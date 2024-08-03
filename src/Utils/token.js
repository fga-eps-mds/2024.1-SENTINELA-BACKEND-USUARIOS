const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET } = process.env;

const generateToken = (user_id) => {
    const token = jwt.sign({ id: user_id }, SECRET, { expiresIn: "30d" }); // Token expira em 30 dias
    return token;
};

const checkToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET);
        return decoded.id;
    } catch {
        return null; // Token inválido ou expirado
    }
};

const tokenValidation = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Separa ---> 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ mensagem: "Tokem não fornecido." });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                mensagem: "Token inválido ou expirado.",
            });
        }

        req.userId = decoded.id;

        next();
    });
};

module.exports = { generateToken, checkToken, tokenValidation };
