const mongoose = require('mongoose');

const membershipFormSchema = new mongoose.Schema({ // estou fazendoo um novo schema no meu banco de daods 

    nomeCompleto: {
        type: String,
        required: true
    }, 
    tipoSanguineo: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
},
    matricula: {
    type: String,
    required: true,
    unique: true
    // immutable: true
    },
    dataDeNascimento: {
    type: Date,
    required: true
    },
    sexo: {
    type: String,
    required: true,
    enum: ['Masculino', 'Feminino', 'Outro']
},
naturalidade: {
    type: String,
    required: true
    },
uf: {
    type: String,
    required: true,
    enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
  },
  estadoCivil: {
    type: String,
    required: true,
    enum: ['Solteiro', 'Casado', 'Separado', 'Viúvo']
  },
  escolaridade: {
    type: String,
    required: true,
    enum: ['Ensino Fundamental', 'Ensino Médio', 'Ensino Técnico', 'Ensino Superior', 'Pós-Graduação', 'Mestrado', 'Doutorado']
  },
  rg: {
    type: Number,
    required: true,
    unique: true
    // immutable: true
  },
  orgao: {
    type: String,
    required: true
    // enum: []
  },
  cpf: {
    type: Number,
    required: true,
    unique: true
    // immutable: true
  },

}
)
const membershipForm = mongoose.model('Membership', membershipFormSchema); 
module.exports = membershipForm;