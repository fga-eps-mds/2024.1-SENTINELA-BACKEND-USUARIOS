const mongoose = require("mongoose");
const occupancySchema = require("./occupancySchema"); // Certifique-se de que está importando o esquema

const organSchema = new mongoose.Schema({
    orgao: {
        type: String,
        required: true,
    },
    lotacao: {
        type: [occupancySchema], // Usando o esquema occupancySchema dentro de um array
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Pelo menos uma lotação é obrigatória.",
        },
    },
});

const Organ = mongoose.model("Organ", organSchema);
module.exports = Organ;
