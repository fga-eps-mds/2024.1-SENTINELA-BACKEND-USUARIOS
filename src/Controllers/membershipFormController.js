const MembershipForm = require("../Models/membershipFormSchema");

const createMembershipForm = async (req, res) => {
    try {
        console.log("Recebido body da requisição:", req.body);

        const formData = req.body.formData;

        const existingMembership = await MembershipForm.findOne({
            $or: [
                { cpf: formData.cpf },
                { matricula: formData.matricula },
                { email: formData.email },
                { rg: formData.rg },
            ],
        });

        if (existingMembership) {
            let errorMessage = "Erro: ";
            if (existingMembership.cpf === formData.cpf)
                errorMessage += "CPF já cadastrado. ";
            if (existingMembership.matricula === formData.matricula)
                errorMessage += "Matrícula já cadastrada. ";
            if (existingMembership.email === formData.email)
                errorMessage += "Email já cadastrado. ";
            if (existingMembership.rg === formData.rg)
                errorMessage += "RG já cadastrado. ";

            return res.status(777).json({ erro: errorMessage.trim() });
        }

        const membership = new MembershipForm(formData);
        await membership.save();
        console.log("Formulário de membro criado com sucesso:", membership);
        return res.status(201).send(membership);
    } catch (error) {
        console.error("Erro ao criar formulário de membro:", error);
        return res.status(888).send({ error });
    }
};

const getMembershipForm = async (req, res) => {
    try {
        const membership = await MembershipForm.find({});
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const deleteMembershipForm = async (req, res) => {
    try {
        const membership = await MembershipForm.findByIdAndDelete(
            req.params.id
        );
        if (!membership) {
            return res.status(404).send({ error });
        }
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error });
    }
};

module.exports = {
    createMembershipForm,
    getMembershipForm,
    deleteMembershipForm,
};
