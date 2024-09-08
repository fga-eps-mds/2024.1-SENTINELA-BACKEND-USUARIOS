const mongoose = require("mongoose");
const User = require("./userSchema");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [
        {
            module: { type: String, required: true },
            access: {
                type: [String],
                required: true,
                enum: ["create", "read", "update", "delete"],
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isProtected: {
        type: Boolean,
        default: false,
    },
});

roleSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        try {
            const defaultRole = await Role.findOne({ name: "Usuário" });

            if (defaultRole) {
                await User.updateMany(
                    { role: doc._id },
                    { role: defaultRole._id }
                );
            } else {
                console.error(
                    "Role padrão não encontrada. Nenhuma atualização foi feita nos usuários."
                );
            }
        } catch (error) {
            console.error(
                "Erro ao atualizar usuários para a role padrão:",
                error
            );
        }
    }
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
