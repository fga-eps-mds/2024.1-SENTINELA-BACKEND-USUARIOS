const Token = require("../Models/tokenSchema");
const { checkToken } = require("../Utils/token");

const getToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).send({ message: "Token não fornecido" });
        }

        const achei = await Token.findOne({ token: token });

        if (!achei) {
            return res.status(404).send({ message: "Token não encontrado" });
        }

        const userId = checkToken(token);

        if (!userId) {
            return res.status(401).send({ message: "Token inválido" });
        }

        return res.status(200).send({ userId });
    } catch (error) {
        return res.status(500).send({
            message: "Erro interno do servidor",
            error: error.message,
        });
    }
};

module.exports = {
    getToken,
};
