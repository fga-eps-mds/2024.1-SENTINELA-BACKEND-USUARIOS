const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const { MongoMemoryServer } = require("mongodb-memory-server");
const initializeRoles = require("../Utils/initDatabase");

const app = express();
let mongoServer;

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Aplicar o middleware antes das rotas
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", routes);

beforeAll(async () => {
    console.log("Starting beforeAll hook");

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
    await initializeRoles();
    console.log("Finished beforeAll hook");
}, 30000);

afterAll(async () => {
    console.log("Starting afterAll hook");
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log("Finished afterAll hook");
}, 30000);

describe("User Controller Tests", () => {
    let authToken;
    let userId;

    it("should create a new user", async () => {
        const res = await request(app).post("/signup").send({
            name: "Jane Doe",
            email: "janedoe@admin.com",
            phone: "4002-8933",
            status: true,
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.name).toBe("Jane Doe");
        expect(res.body.email).toBe("janedoe@admin.com");
    });

    it("should log in a user with correct credentials", async () => {
        const res = await request(app).post("/login").send({
            email: "admin@admin.com",
            password: "senha",
        });

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("admin@admin.com");

        authToken = res.body.token;
        userId = res.body.user._id;
    });

    it("should return 400 for invalid credentials", async () => {
        const res = await request(app).post("/login").send({
            email: "admin@admin.com",
            password: "senha2",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Email ou senha inválidos.");
    });

    it("should not allow access to protected routes without a token", async () => {
        const res = await request(app).get("/users");

        expect(res.status).toBe(401);
    });

    it("should not allow access to protected routes with an invalid token", async () => {
        const res = await request(app)
            .get("/users")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
    });

    it("should get all users", async () => {
        const res = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should get a user by id", async () => {
        const res = await request(app)
            .get(`/users/${userId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "admin@admin.com");
    });

    it("should return 500 for non-existent user", async () => {
        const res = await request(app)
            .get(`/users/invalidid`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(500);
    });

    it("should update a user", async () => {
        const res = await request(app)
            .patch(`/users/patch/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({ updatedUser: { name: "Updated Name" } });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Updated Name");
    });

    it("should return 500 for non-existent user when deleting", async () => {
        const res = await request(app)
            .delete(`/users/delete/invalidid`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(500);
    });

    it("should recover password for existing user", async () => {
        const res = await request(app)
            .post("/users/recover-password")
            .send({ email: "admin@admin.com" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("mensagem");
    });

    it("should not recover password for non-existent user", async () => {
        const res = await request(app)
            .post("/users/recover-password")
            .send({ email: "nonexistent@admin.com" });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("mensagem", "Usuário não encontrado.");
    });

    it("should check permission for existing user", async () => {
        const res = await request(app)
            .get(`/users/${userId}/permission`)
            .set("Authorization", `Bearer ${authToken}`)
            .query({ moduleName: "users", action: "read" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("hasPermission");
    });

    it("should not check permission for non-existent user", async () => {
        const fakeId = 1234;
        const res = await request(app)
            .get(`/users/${fakeId}/permission`)
            .set("Authorization", `Bearer ${authToken}`)
            .query({ moduleName: "module1", action: "read" });

        expect(res.status).toBe(400 || 500);
        expect(res.body).toHaveProperty("message");
    });

    it("should delete a user", async () => {
        const res = await request(app)
            .delete(`/users/delete/${userId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "admin@admin.com");
    });
});

describe("Role Controller Tests", () => {
    let authToken;
    let roleId;

    // Teste criar um role
    it("should create a role", async () => {
        const res = await request(app)
            .post("/role/create")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: "Admin",
                permissions: [
                    {
                        module: "module1",
                        access: ["create", "read", "update", "delete"],
                    },
                ],
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("name", "Admin");
        roleId = res.body._id; // Guardar o ID do role criado
    });

    // Teste obter todos os roles
    it("should get all roles", async () => {
        await request(app)
            .post("/role/create")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: "Admin",
                permissions: [
                    {
                        module: "module1",
                        access: ["create", "read", "update", "delete"],
                    },
                ],
            });

        const res = await request(app)
            .get("/role")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Teste obter um role por ID
    it("should get a role by ID", async () => {
        const res = await request(app)
            .get(`/role/${roleId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Admin");
    });

    // Teste atualizar um role por ID
    it("should update a role by ID", async () => {
        const res = await request(app)
            .patch(`/role/patch/${roleId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: "Updated Role",
                permissions: [{ module: "module2", access: ["read"] }],
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Updated Role");
    });

    // Teste deletar um role por ID
    it("should delete a role by ID", async () => {
        const res = await request(app)
            .delete(`/role/delete/${roleId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(204);

        // Verificar se o role foi realmente deletado
        const checkRole = await request(app)
            .get(`/role/${roleId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(checkRole.status).toBe(404);
    });
});
