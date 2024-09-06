const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes"); // Ajuste o caminho conforme necessário
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
let mongoServer;

// Configurações CORS
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

const generateRoleData = (suffix) => ({
    name: `Perfil Teste ${suffix}`,
    permissions: [
        {
            module: "finance",
            access: ["create"],
        },
        {
            module: "benefits",
            access: ["create"],
        },
        {
            module: "users",
            access: ["create"],
        },
    ],
});

const createRole = async (data) => {
    const response = await request(app).post("/role/create").send(data);
    return response;
};

describe("RoleController Test Suite", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("POST /role/create", () => {
        it("should create a new role", async () => {
            const newRole = generateRoleData("001");
            const response = await createRole(newRole);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
        });

        it("should not create a role with duplicate data", async () => {
            // Create First Data
            const duplicateRole = generateRoleData("002");
            await createRole(duplicateRole);

            // Duplicate it
            const response = await createRole(duplicateRole);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("GET /role", () => {
        it("should retrieve all roles", async () => {
            const response = await request(app).get("/role");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe("GET /role/:id", () => {
        it("should retrieve a specific role by ID", async () => {
            //Create Role
            const newRole = generateRoleData("003");
            const postResponse = await createRole(newRole);
            expect(postResponse.status).toBe(201);
            expect(postResponse.body).toHaveProperty("_id");

            //Get ID and try access
            const roleId = postResponse.body._id;
            const getResponse = await request(app).get(`/role/${roleId}`);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toHaveProperty("_id", roleId);
        });
    });

    describe("PATCH /role/patch/:id", () => {
        it("should update the role data", async () => {
            //Create Role
            const roleData = generateRoleData("007");
            const postResponse = await createRole(roleData);
            expect(postResponse.status).toBe(201);

            const roleId = postResponse.body._id;
            const updatedData = {
                name: "Perfil Updated",
            };

            const response = await request(app)
                .patch(`/role/patch/${roleId}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id", roleId);
            expect(response.body.name).toBe("Perfil Updated");
        });
    });

    describe("DELETE /role/:id", () => {
        it("should delete a specific role", async () => {
            const newRole = generateRoleData("004");
            const postResponse = await createRole(newRole);
            expect(postResponse.status).toBe(201);
            const roleId = postResponse.body._id;

            const deleteResponse = await request(app).delete(
                `/role/delete/${roleId}`
            );
            expect(deleteResponse.status).toBe(204);
        });
    });
});
