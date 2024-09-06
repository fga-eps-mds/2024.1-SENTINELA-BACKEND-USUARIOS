const Organ = require("../Models/organSchema");
const mongoose = require("mongoose");

const createOrgan = async (req, res) => {
    try {
        const { orgao, lotacao } = req.body;

        // Verifica se o órgão já existe
        if (typeof orgao == "string") {
            const existingOrgan = await Organ.findOne({ orgao });

            if (existingOrgan) {
                return res.status(409).send({ error: "Nome já cadastrado" });
            }
        } else {
            return res.status(500).send({ error: "Tipo de dado incorreto" });
        }

        const organ = new Organ({ orgao, lotacao });
        await organ.save();

        return res.status(201).send(organ);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

const listOrgans = async (req, res) => {
    try {
        const organs = await Organ.find();
        return res.status(200).send(organs);
    } catch (error) {
        return res.status(500).send({ error });
    }
};

const updateOrgan = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        console.log(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "ID inválido" });
        }

        // Log dos dados recebidos
        console.log("Dados recebidos para atualização:", req.body);

        // Atualizar apenas os campos fornecidos
        const organ = await Organ.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!organ) {
            return res.status(404).send({ message: "Conta não encontrada" });
        }

        // Retornar o objeto atualizado
        res.status(200).send(organ); // Corrigido para 'organ'
    } catch (error) {
        console.error("Erro ao atualizar conta bancária:", error.message);
        res.status(500).send({ error: error.message });
    }
};

const getOrganById = async (req, res) => {
    try {
        console.log(req.params.id);

        // Buscar o documento pelo ID
        const organ = await Organ.findById(req.params.id);

        if (!organ) {
            return res.status(404).send({ message: "Organ não encontrado" });
        }

        return res.status(200).send(organ);
    } catch (error) {
        console.error("Erro ao buscar Organ:", error.message);
        return res.status(500).send({ error: error.message });
    }
};

const deleteOrganById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "ID inválido" });
        }

        // Buscar e excluir o documento
        const organ = await Organ.findByIdAndDelete(id);
        if (!organ) {
            return res.status(404).send({ message: "Organ não encontrado" });
        }

        // Retornar o documento excluído
        res.status(200).send(organ);
    } catch (error) {
        console.error("Erro ao excluir Organ:", error.message);
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createOrgan,
    listOrgans,
    updateOrgan,
    getOrganById,
    deleteOrganById,
};
