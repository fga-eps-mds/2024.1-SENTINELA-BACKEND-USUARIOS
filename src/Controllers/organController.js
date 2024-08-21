const Organ = require("../Models/organSchema");

const createOrgan = async (req, res) => {
    try {
        const { orgao, lotacao } = req.body;
        const organ = new Organ({ orgao, lotacao });
        await organ.save();
        return res.status(201).send(organ);
    } catch (error) {
        return res.status(500).send({ error });
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

module.exports = {
    createOrgan,
    listOrgans,
};
