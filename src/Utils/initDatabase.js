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
            name: "sindicalizado",
            permissions: [
                {
                    module: "basic",
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
                    name: "Admin",
                    email: "admin@admin.com",
                    phone: "1234567890",
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
