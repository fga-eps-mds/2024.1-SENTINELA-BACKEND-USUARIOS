const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const initializeRoles = require('./Utils/initDatabase');

const {
  NODE_ENV,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_URI,
  DB_HOST,
  PORT
} = process.env;

const corsOption = {
  origin: ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}
// Aplicar o middleware CORS antes das rotas
app.use(cors(corsOption));

// Middleware para parsear JSON
app.use(bodyParser.json());

console.log(NODE_ENV)

//
let url;
if(NODE_ENV === "development" || NODE_ENV === "test") {
  url = MONGO_URI;
} else {
  url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_HOST}/`;
}

const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(url);
    console.log('Connected to MongoDB');

    // Configurar rotas
    app.use('/', routes);

    // Endpoint para verificar se o servidor está pronto
    app.get('/ready', (req, res) => {
      res.sendStatus(200);
    });

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('NODE_ENV:', NODE_ENV);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB or initializing roles', err);
    process.exit(1);
  }
};

// Para desenvolvimento e execução normal
if (NODE_ENV !== "test") {
  startServer();
}

module.exports = {app, startServer};