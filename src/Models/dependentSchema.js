const mongoose = require('mongoose');

const dependentSchema = new mongoose.Schema({
    nomeCompletoDependente: {
        type: String,
        required: true
    },
    dataNasc: {
        type: Date,
        required: true
    },
    parentesco: {
        type: String,
        required: true
    },
    cpfDependente: {
        type: String,
        required: true
    },
    celularDependente: {
        type: String,
        required: true
    },
});

module.exports = dependentSchema;
