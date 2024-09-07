const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const initializeRoles = require("./Utils/initDatabase");

const app = express();

const { NODE_ENV, OFFICIAL_MONGO_URI, MONGO_URI, PORT, FRONT_HOST } =
    process.env;

// Middleware
const corsOption = {
    origin: (origin, callback) => {
        const allowedOrigin = FRONT_HOST || "localhost";
        if (origin?.includes(allowedOrigin) || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Aplicar o middleware CORS antes das rotas
app.use(cors(corsOption));

// Middleware para parsear JSON e dados URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", routes);

// Endpoint para verificar se o servidor está pronto
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

let url;
if (NODE_ENV !== "deployment") {
    url = MONGO_URI;
} else {
    url = OFFICIAL_MONGO_URI;
}

const startServer = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(url);
        console.log("Connected to MongoDB");

        // Inicializar roles
        await initializeRoles();

        // Iniciar o servidor
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("NODE_ENV:", NODE_ENV);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB or initializing roles", err);
        process.exit(1);
    }
};

// Para desenvolvimento e execução normal
if (NODE_ENV != "teste") {
    startServer();
}

module.exports = { app, startServer };
