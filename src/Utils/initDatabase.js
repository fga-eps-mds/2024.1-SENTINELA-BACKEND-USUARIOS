// ./utils/initRoles.js
const mongoose = require("mongoose");
const Role = require("../Models/roleSchema"); // Ajuste o caminho conforme necessário
const User = require("../Models/userSchema");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync();

const initializeRoles = async () => {
    const roles = [
        {
            name: "administrador",
            permissions: [
                {
                    module: "users",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "finance",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "benefits",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "juridic",
                    access: ["create", "read", "update", "delete"],
                },
            ],
        },
        {
            name: "diretoria",
            permissions: [
                {
                    module: "finance",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "benefits",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "juridic",
                    access: ["create", "read", "update", "delete"],
                },
            ],
        },
        {
            name: "jurídico",
            permissions: [
                {
                    module: "juridic",
                    access: ["create", "read", "update", "delete"],
                },
            ],
        },
        {
            name: "colaborador",
            permissions: [
                {
                    module: "benefits",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "juridic",
                    access: ["create", "read", "update", "delete"],
                },
            ],
        },
        {
            name: "advogado",
            permissions: [
                {
                    module: "benefits",
                    access: ["create", "read", "update", "delete"],
                },
                {
                    module: "juridic",
                    access: ["create", "read", "update", "delete"],
                },
            ],
        },
    ];

    try {
        // Verificar se a conexão está aberta antes de executar
        if (mongoose.connection.readyState === 1) {
            for (const roleData of roles) {
                const existingRole = await Role.findOne({
                    name: roleData.name,
                });
                if (!existingRole) {
                    const role = new Role(roleData);
                    await role.save();
                    console.log(`Role ${roleData.name} created`);
                } else {
                    console.log(`Role ${roleData.name} already exists`);
                }
            }
        } else {
            console.error("Mongoose connection is not open");
        }
    } catch (err) {
        console.error("Error initializing roles:", err);
    }

    try {
        // Verificar se a conexão está aberta antes de executar
        if (mongoose.connection.readyState === 1) {
            // Busca o user 'administrador'
            const adminRole = await Role.findOne({ name: "administrador" });
            if (!adminRole) {
                console.error(
                    'Role "administrador" não encontrada. Crie a role antes de adicionar o usuário administrador.'
                );
                return;
            }

            // Verifica se o usuário administrador já existe
            const existingAdmin = await User.findOne({
                email: "admin@admin.com",
            });
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash("senha", salt); // Altere a senha padrão conforme necessário

                // Cria o usuário administrador
                const adminUser = new User({
                    nomeCompleto: "Admin",
                    matricula: "123456",
                    nomeDeGuerra: "Admin",
                    dataDeNascimento: new Date("1980-01-01"),
                    rg: 123456789,
                    cpf: 12345678901,
                    naturalidade: "Cidade Natal",
                    uf: "SP",
                    sexo: "Masculino",
                    estadoCivil: "Solteiro",
                    nomeDoPai: "Pai Admin",
                    nomeDaMae: "Mae Admin",
                    escolaridade: "Ensino Superior",
                    religiao: "Nenhuma",
                    tipoSanguineo: "O+",
                    email: "admin@admin.com", // Make sure to hash the password before saving
                    celular: "1234567890",
                    telefone: "0987654321",
                    cep: 12345678,
                    cidade: "Cidade Admin",
                    logradouro: "Rua Admin",
                    complemento: "Complemento Admin",
                    cargo: "Administrador",
                    dataDeContratacao: new Date("2024-01-01"),
                    lotacao: "Administração",
                    orgao: "Orgão Admin",
                    postoDeTrabalho: "Posto Admin",
                    status: true,
                    password: hashedPassword,
                    role: adminRole._id,
                });

                await adminUser.save();
                console.log("Usuário administrador criado com sucesso.");
            } else {
                console.log("Usuário administrador já existe.");
            }
        } else {
            console.error("Mongoose connection is not open");
        }
    } catch (err) {
        console.error("Error initializing admin user:", err);
    }
};

module.exports = initializeRoles;
