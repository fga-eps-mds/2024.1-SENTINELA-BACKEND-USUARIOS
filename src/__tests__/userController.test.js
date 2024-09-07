const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const { MongoMemoryServer } = require("mongodb-memory-server");
const initializeRoles = require("../Utils/initDatabase");
const User = require("../Models/userSchema");

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

    const protectedUser = await User.create({
        name: "Admin Protected",
        email: "adminprotected@admin.com",
        phone: "4002-8933",
        status: true,
        isProtected: true,
    });
    protectedUserId = protectedUser._id;

    // Criação de um usuário que pode ser deletado para teste
    const deletableUser = await User.create({
        name: "Jane Doe",
        email: "janedoe@admin.com",
        phone: "4002-8933",
        status: true,
        isProtected: false, // Não é protegido
    });
    deletableUserId = deletableUser._id;

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
            name: "Joane Doe",
            email: "joanedoe@admin.com",
            phone: "4202-8933",
            status: true,
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.name).toBe("Joane Doe");
        expect(res.body.email).toBe("joanedoe@admin.com");
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

    it("should not delete a protected user", async () => {
        const res = await request(app)
            .delete(`/users/delete/${protectedUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty(
            "message",
            "Cannot delete protected user"
        );
    });

    it("should delete a user", async () => {
        const res = await request(app)
            .delete(`/users/delete/${deletableUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "janedoe@admin.com");
    });

    it("should recover password for existing user", async () => {
        const res = await request(app)
            .post("/users/recover-password")
            .send({ data: { email: "admin@admin.com" } });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("mensagem");
    });

    it("should not recover password for non-existent user", async () => {
        const res = await request(app)
            .post("/users/recover-password")
            .send({ data: { email: "nonexistent@example.com" } });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("mensagem", "Usuário não encontrado.");
    });
});
