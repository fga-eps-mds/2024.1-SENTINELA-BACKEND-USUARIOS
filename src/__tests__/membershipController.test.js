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

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", routes);

const generateMembershipData = (suffix) => ({
    formData: {
        name: `Nome${suffix}`,
        email: `email${suffix}@test.com`,
        phone: `(11) 11111-11${suffix}`,
        cellPhone: `(11) 11111-11${suffix}`,
        bloodType: "A-",
        registration: `00005550${suffix}`,
        birthDate: "2000-10-10T02:00:00.000Z",
        sex: "Masculino",
        naturalness: `Naturalidade${suffix}`,
        uf_naturalidade: "GO",
        uf_orgao: "ES",
        uf_address: "GO",
        marialStatus: "Solteiro",
        education: "Ensino Médio",
        rg: 1234567 + Number(suffix),
        orgao: "Orgao Exp",
        cpf: `111.211.11${suffix}-11`,
        hiringDate: "2024-08-05T03:00:00.000Z",
        expeditionDate: "2018-07-10T03:00:00.000Z",
        position: `Cargo${suffix}`,
        lotacao: `Lotacao${suffix}`,
        cep: "11111-111",
        motherName: `Mae${suffix}`,
        fatherName: `Pai${suffix}`,
        city: `Cidade${suffix}`,
        street: `Logradouro${suffix}`,
        complement: `Complemento${suffix}`,
        landline: `(11) 11111-11${suffix}`,
        workPlace: `Posto${suffix}`,
        shipperOrganization: `orgao${suffix}`,
        religion: `Religiao${suffix}`,
        dependents: [],
    },
});

const createMembership = async (data) => {
    const response = await request(app).post("/membership/create").send(data);
    return response;
};

describe("MembershipController Test Suite", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await initializeRoles();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("POST /membership/create", () => {
        it("should create a new membership", async () => {
            const newMembership = generateMembershipData("001");
            const response = await createMembership(newMembership);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.email).toBe(newMembership.formData.email);
        });

        it("should not create a membership with duplicate data", async () => {
            const duplicateMembership = generateMembershipData("002");
            await createMembership(duplicateMembership);
            const response = await createMembership(duplicateMembership);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("erro");
        });
    });

    describe("GET /membership", () => {
        it("should retrieve all membership forms", async () => {
            const response = await request(app).get("/membership");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe("GET /membership/:id", () => {
        it("should retrieve a specific membership by ID", async () => {
            const newMembership = generateMembershipData("003");
            const postResponse = await createMembership(newMembership);
            expect(postResponse.status).toBe(201);
            expect(postResponse.body).toHaveProperty("_id");

            const membershipId = postResponse.body._id;
            const getResponse = await request(app).get(
                `/membership/${membershipId}`
            );

            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toHaveProperty("_id", membershipId);
        });
    });

    describe("DELETE /membership/:id", () => {
        it("should delete a specific membership", async () => {
            const newMembership = generateMembershipData("004");
            const postResponse = await createMembership(newMembership);
            expect(postResponse.status).toBe(201);
            const membershipId = postResponse.body._id;

            const deleteResponse = await request(app).delete(
                `/membership/delete/${membershipId}`
            );
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toHaveProperty("_id", membershipId);
        });
    });
});
