const mongoose = require("mongoose");
const User = require("./userSchema");
const dependentSchema = require("./dependentSchema");

const Membership = User.discriminator(
    "Membership",
    new mongoose.Schema({
        bloodType: {
            type: String,
            enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        registration: {
            type: String,
            unique: true,
            required: true,
        },
        birthDate: {
            type: Date,
        },
        sex: {
            type: String,
            enum: ["", "Masculino", "Feminino"],
            required: true,
        },
        naturalness: {
            type: String,
        },
        uf_naturalidade: {
            type: String,

            enum: [
                "",
                "AC",
                "AL",
                "AP",
                "AM",
                "BA",
                "CE",
                "DF",
                "ES",
                "GO",
                "MA",
                "MT",
                "MS",
                "MG",
                "PA",
                "PB",
                "PR",
                "PE",
                "PI",
                "RJ",
                "RN",
                "RS",
                "RO",
                "RR",
                "SC",
                "SP",
                "SE",
                "TO",
            ],
        },
        uf_orgao: {
            type: String,
            enum: [
                "",
                "AC",
                "AL",
                "AP",
                "AM",
                "BA",
                "CE",
                "DF",
                "ES",
                "GO",
                "MA",
                "MT",
                "MS",
                "MG",
                "PA",
                "PB",
                "PR",
                "PE",
                "PI",
                "RJ",
                "RN",
                "RS",
                "RO",
                "RR",
                "SC",
                "SP",
                "SE",
                "TO",
            ],
        },
        uf_address: {
            type: String,
            enum: [
                "",
                "AC",
                "AL",
                "AP",
                "AM",
                "BA",
                "CE",
                "DF",
                "ES",
                "GO",
                "MA",
                "MT",
                "MS",
                "MG",
                "PA",
                "PB",
                "PR",
                "PE",
                "PI",
                "RJ",
                "RN",
                "RS",
                "RO",
                "RR",
                "SC",
                "SP",
                "SE",
                "TO",
            ],
        },
        maritalStatus: {
            type: String,
            enum: ["", "Solteiro", "Casado", "Separado", "Viúvo"],
        },
        education: {
            type: String,
            enum: [
                "",
                "Ensino Fundamental",
                "Ensino Médio",
                "Ensino Técnico",
                "Ensino Superior",
                "Pós-Graduação",
                "Mestrado",
                "Doutorado",
            ],
        },
        rg: {
            type: Number,
            unique: true,
            required: true,
        },
        orgao: {
            type: String,
        },
        cpf: {
            type: String,
            unique: true,
            required: true,
        },
        hiringDate: {
            type: Date,
        },
        expeditionDate: {
            type: Date,
        },
        position: {
            type: String,
        },
        lotacao: {
            type: String,
        },
        cep: {
            type: String,
        },
        motherName: {
            type: String,
        },
        fatherName: {
            type: String,
        },
        city: {
            type: String,
        },
        street: {
            type: String,
        },
        complement: {
            type: String,
        },
        landline: {
            type: String,
        },
        workPlace: {
            type: String,
        },
        shipperOrganization: {
            type: String,
        },
        religion: {
            type: String,
        },
        dependents: [dependentSchema],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    })
);

module.exports = Membership;
