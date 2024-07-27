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
    origin: ["http://localhost:5173/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// Aplicar o middleware CORS antes das rotas
app.use(cors(corsOptions));

// Middleware para parsear JSON e dados URL-encoded
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

        console.log("token: ", res.body.token);

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
            .send({ name: "Updated Name" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Updated Name");
    });

    it("should delete a user", async () => {
        const res = await request(app)
            .delete(`/users/delete/${userId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "admin@admin.com");
    });

    it("should return 500 for non-existent user when deleting", async () => {
        const res = await request(app)
            .delete(`/users/delete/invalidid`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(500);
    });
});
