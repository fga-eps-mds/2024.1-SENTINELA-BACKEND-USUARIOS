const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usuarioRoutes = require('./Controllers/users');
const cors = require('cors');
app.use(cors());

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/sentinela-users';

// Conectar ao MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Conectado ao MongoDB');
  }).catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
    process.exit(1);
  });

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rotas
app.use('/api', usuarioRoutes);

// Teste de rota
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
