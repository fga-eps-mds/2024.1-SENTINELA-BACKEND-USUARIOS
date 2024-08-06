const { sendEmail } = require("../Utils/email");

const MembershipForm = require("../Models/membershipFormSchema");

const createMembershipForm = async (req, res) => {
    try {
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

        //Situação Atual = Status
        if (formData.situacaoAtual == "Inativo") {
            membership.status = false;
        }

        await membership.save();
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

const getOnlyNames = async (req, res) => {
    try {
        const membership = await MembershipForm.find({}).select(
            "nomeCompleto _id status"
        );
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

const updateStatusMembership = async (req, res) => {
    try {
        const membership = await MembershipForm.findById(req.params.id);
        if (!membership) {
            return res.status(404).send({ error });
        }
        membership.status = !membership.status;
        await membership.save();
        const bodyEmail = `Olá ${membership.nomeCompleto}, \n \n
É um prazer tê-la conosco. O Sentinela oferece uma experiência única em gestão sindical, com suporte e atendimento personalizados. \n
Para criar uma senha de acesso ao sistema clique no link: \n \n


Caso tenha dúvidas sobre o acesso à sua conta ou outras questões, entre em contato com nossa equipe de Suporte através do e-mail suporte@sentinela.sindpol.org.br ou pelo telefone (61) 3321-1949. Estamos disponíveis de segunda a sexta-feira, das 8h às 12h e das 14h às 18h no horário de Brasília.`;
        const sended = await sendEmail(
            membership.email,
            "Solicitação de Membro",
            bodyEmail
        );
        if (!sended) {
            return res.status(500).send({ error: "Falha ao enviar email." });
        }
        console.log("Email enviado com sucesso!");
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

const deleAll = async (req, res) => {
    try {
        await MembershipForm.deleteMany({});
        return res
            .status(200)
            .send({ message: "All membership forms deleted" });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

module.exports = {
    createMembershipForm,
    getMembershipForm,
    deleteMembershipForm,
    getOnlyNames,
    updateStatusMembership,
    deleAll,
};
