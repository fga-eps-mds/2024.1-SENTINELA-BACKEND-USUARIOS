const mongoose = require("mongoose");

const occupancySchema = new mongoose.Schema({
    nomeLotacao: {
        type: String,
        required: true,
    },
    sigla: {
        type: String,
        required: true,
    },
});

module.exports = occupancySchema; // Exportando o esquema, não o modelo
