const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: true
  },
  matricula: {
    type: String,
    required: true,
    unique: true
    // immutable: true
  },
  nomeDeGuerra: {
    type: String,
    required: true,
    unique: true
  },
  dataDeNascimento: {
    type: Date,
    required: true
  },
  rg: {
    type: Number,
    required: true,
    unique: true
    // immutable: true
  },
  cpf: {
    type: Number,
    required: true,
    unique: true
    // immutable: true
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
  sexo: {
    type: String,
    required: true,
    enum: ['Masculino', 'feminino']
  },
  estadoCivil: {
    type: String,
    required: true,
    enum: ['Solteiro', 'Casado', 'Separado', 'Viúvo']
  },
  nomeDoPai: {
    type: String,
    required: true
  },
  nomeDaMae: {
    type: String,
    required: true
  },
  escolaridade: {
    type: String,
    required: true,
    enum: ['Ensino Fundamental', 'Ensino Médio', 'Ensino Técnico', 'Ensino Superior', 'Pós-Graduação', 'Mestrado', 'Doutorado']
  },
  religiao: {
    type: String
  },
  tipoSanguineo: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  situacaoAtual: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  celular: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String,
    required: true
  },
  cep: {
    type: Number,
    required: true
  },
  cidade: {
    type: String,
    required: true
  },
  logradouro: {
    type: String,
    required: true
  },
  complemento: {
    type: String
  },
  cargo: {
    type: String,
    required: true
    // enum: []
  },
  dataDeContratacao: {
    type: Date,
    required: true
  },
  lotacao: {
    type: String,
    required: true
    // enum: []
  },
  orgao: {
    type: String,
    required: true
    // enum: []
  },
  postoDeTrabalho: {
    type: String,
    required: true
    // enum: []
  },
  status: {
    type: String,
    enum: ['Ativo', 'Inativo'],
    default: 'Ativo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
