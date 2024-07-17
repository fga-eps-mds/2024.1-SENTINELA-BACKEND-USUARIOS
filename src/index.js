const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const initialize = require('./Utils/initDatabase');
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

//
let url;
if(NODE_ENV === "development") {
  url = MONGO_URI;
} else {
  url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_HOST}/`;
}

// Conect to MongoB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Inicializar roles
    await initializeRoles();
    console.log('Roles initialized');

    // rotas
    app.use('/', routes);

    // Rota de teste
    app.get('/', (req, res) => {
      res.send('Hello, world!');
    });

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('NODE_ENV:', NODE_ENV);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });

module.exports = app;