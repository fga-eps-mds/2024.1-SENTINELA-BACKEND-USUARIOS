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

describe("MembershipController Test Suite", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Initialize roles if necessary
        await initializeRoles();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("POST /membership/create", () => {
        it("should create a new membership", async () => {
            const newMembership = {
                formData: {
                    name: "nome",
                    email: "email@test.com",
                    phone: "(11) 11111-1111",
                    cellPhone: "(11) 11111-1111",
                    bloodType: "A-",
                    registration: "0000555000",
                    birthDate: "2000-10-10T02:00:00.000Z",
                    sex: "Masculino",
                    naturalness: "Naturalidade",
                    uf_naturalidade: "GO",
                    uf_orgao: "ES",
                    uf_address: "GO",
                    marialStatus: "Solteiro",
                    education: "Ensino Médio",
                    rg: 1234567,
                    orgao: "Orgao Exp",
                    cpf: "111.211.111-11",
                    hiringDate: "2024-08-05T03:00:00.000Z",
                    expeditionDate: "2018-07-10T03:00:00.000Z",
                    position: "Cargo",
                    lotacao: "Lotacao",
                    cep: "11111-111",
                    motherName: "Mae",
                    fatherName: "Pai",
                    city: "Cidade",
                    street: "Logradouro",
                    complement: "Complemento",
                    landline: "(11) 11111-1111",
                    workPlace: "Posto",
                    shipperOrganization: "orgao",
                    religion: "Religiao",
                    dependents: [],
                },
            };

            const response = await request(app)
                .post("/membership/create")
                .send(newMembership);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.email).toBe("email@test.com");
        });

        it("should not create a membership with duplicate data", async () => {
            const duplicateMembership = {
                formData: {
                    name: "User Duplicado",
                    email: "email@test.com",
                    phone: "(11) 11111-1111",
                    cellPhone: "(11) 11111-1111",
                    bloodType: "A-",
                    registration: "0000555000",
                    birthDate: "2000-10-10T02:00:00.000Z",
                    sex: "Masculino",
                    naturalness: "Naturalidade",
                    uf_naturalidade: "GO",
                    uf_orgao: "ES",
                    uf_address: "GO",
                    marialStatus: "Solteiro",
                    education: "Ensino Médio",
                    rg: 1234567,
                    orgao: "Orgao Exp",
                    cpf: "111.211.111-11",
                    hiringDate: "2024-08-05T03:00:00.000Z",
                    expeditionDate: "2018-07-10T03:00:00.000Z",
                    position: "Cargo",
                    lotacao: "Lotacao",
                    cep: "11111-111",
                    motherName: "Mae",
                    fatherName: "Pai",
                    city: "Cidade",
                    street: "Logradouro",
                    complement: "Complemento",
                    landline: "(11) 11111-1111",
                    workPlace: "Posto",
                    shipperOrganization: "orgao",
                    religion: "Religiao",
                    dependents: [],
                },
            };

            const response = await request(app)
                .post("/membership/create")
                .send(duplicateMembership);

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
            const newMembership = {
                formData: {
                    name: "Nome-001",
                    email: "email-001@test.com",
                    phone: "(11) 11111-3111",
                    cellPhone: "(11) 12211-1112",
                    bloodType: "A-",
                    registration: "0000355001",
                    birthDate: "2000-10-10T02:00:00.000Z",
                    sex: "Masculino",
                    naturalness: "Naturalidade-001",
                    uf_naturalidade: "GO",
                    uf_orgao: "ES",
                    uf_address: "GO",
                    marialStatus: "Solteiro",
                    education: "Ensino Médio",
                    rg: 1235569,
                    orgao: "Orgao Exp-001",
                    cpf: "111.211.151-11",
                    hiringDate: "2024-08-05T03:00:00.000Z",
                    expeditionDate: "2018-07-10T03:00:00.000Z",
                    position: "Cargo-001",
                    lotacao: "Lotacao-001",
                    cep: "11111-111",
                    motherName: "Mae-001",
                    fatherName: "Pai-001",
                    city: "Cidade-001",
                    street: "Logradouro-001",
                    complement: "Complemento-001",
                    landline: "(11) 11611-1111",
                    workPlace: "Posto-001",
                    shipperOrganization: "orgao-001",
                    religion: "Religiao-001",
                    dependents: [],
                },
            };

            const postResponse = await request(app)
                .post("/membership/create")
                .send(newMembership);

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

    // Broken code for patching
    // describe("PATCH /membership/updateStatus/:id", () => {
    //     it("should update the status of a specific membership", async () => {
    //         const newMembership = {
    //             formData: {
    //                 name: "Nome-003",
    //                 email: "email-003@test.com",
    //                 phone: "(11) 11111-1116",
    //                 cellPhone: "(11) 11111-1117",
    //                 bloodType: "O-",
    //                 registration: "0000555003",
    //                 birthDate: "1985-12-12T02:00:00.000Z",
    //                 sex: "Masculino",
    //                 naturalness: "Naturalidade-003",
    //                 uf_naturalidade: "SP",
    //                 uf_orgao: "RJ",
    //                 uf_address: "SP",
    //                 marialStatus: "Divorciado",
    //                 education: "Mestrado",
    //                 rg: 9876543,
    //                 orgao: "Orgao Exp-003",
    //                 cpf: "333.433.333-33",
    //                 hiringDate: "2024-05-10T03:00:00.000Z",
    //                 expeditionDate: "2015-03-15T03:00:00.000Z",
    //                 position: "Cargo-003",
    //                 lotacao: "Lotacao-003",
    //                 cep: "33333-333",
    //                 motherName: "Mae-003",
    //                 fatherName: "Pai-003",
    //                 city: "Cidade-003",
    //                 street: "Logradouro-003",
    //                 complement: "Complemento-003",
    //                 landline: "(11) 11111-1118",
    //                 workPlace: "Posto-003",
    //                 shipperOrganization: "orgao-003",
    //                 religion: "Religiao-003",
    //                 dependents: []
    //             }
    //         };

    //         const postResponse = await request(app)
    //             .post("/membership/create")
    //             .send(newMembership);

    //         const membershipId = postResponse.body._id;

    //         const patchResponse = await request(app)
    //             .patch(`/membership/updateStatus/${membershipId}`)
    //             .send({ status: true });

    //         expect(patchResponse.status).toBe(200);
    //         expect(patchResponse.body).toHaveProperty("status", true);
    //     });
    // });

    describe("DELETE /membership/:id", () => {
        it("should delete a specific membership", async () => {
            const newMembership = {
                formData: {
                    name: "John Doe-004",
                    email: "john.doe-004@test.com",
                    phone: "(11) 11111-1119",
                    cellPhone: "(11) 11111-1120",
                    bloodType: "AB+",
                    registration: "0000555004",
                    birthDate: "1995-04-25T02:00:00.000Z",
                    sex: "Masculino",
                    naturalness: "Naturalidade-004",
                    uf_naturalidade: "SC",
                    uf_orgao: "PR",
                    uf_address: "SC",
                    marialStatus: "Viúvo",
                    education: "Doutorado",
                    rg: 6543210,
                    orgao: "Orgao Exp-004",
                    cpf: "444.544.444-44",
                    hiringDate: "2024-02-20T03:00:00.000Z",
                    expeditionDate: "2019-06-01T03:00:00.000Z",
                    position: "Cargo-004",
                    lotacao: "Lotacao-004",
                    cep: "44444-444",
                    motherName: "Mae-004",
                    fatherName: "Pai-004",
                    city: "Cidade-004",
                    street: "Logradouro-004",
                    complement: "Complemento-004",
                    landline: "(11) 11111-1121",
                    workPlace: "Posto-004",
                    shipperOrganization: "orgao-004",
                    religion: "Religiao-004",
                    dependents: [],
                },
            };

            const postResponse = await request(app)
                .post("/membership/create")
                .send(newMembership);

            const membershipId = postResponse.body._id;

            const deleteResponse = await request(app).delete(
                `/membership/delete/${membershipId}`
            );

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toHaveProperty("_id", membershipId);
        });
    });
});
