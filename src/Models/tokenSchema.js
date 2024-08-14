const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
