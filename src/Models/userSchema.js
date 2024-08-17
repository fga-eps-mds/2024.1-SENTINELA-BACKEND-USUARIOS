const mongoose = require("mongoose");
const dependentSchema = require("./dependentSchema");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    cellPhone: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: false,
    },
    bloodType: {
        type: String,
        enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    registration: {
        type: String,
        sparse: true,
    },
    birthDate: {
        type: Date,
    },
    sex: {
        type: String,
        enum: ["", "Masculino", "Feminino"],
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
    marialStatus: {
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
        sparse: true,
    },
    orgao: {
        type: String,
    },
    cpf: {
        type: String,
        sparse: true,
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
    status: {
        type: Boolean,
        default: false,
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
});

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

userSchema.set("toObject", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
