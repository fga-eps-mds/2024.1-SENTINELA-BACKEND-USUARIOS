const { sendEmail } = require("../Utils/email");
const User = require("../Models/userSchema");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();

const createMembershipForm = async (req, res) => {
    try {
        const formData = req.body.formData;
        const existingMembership = await User.findOne({
            $or: [
                { cpf: formData.cpf },
                { registration: formData.matricula },
                { email: formData.email },
                { rg: formData.rg },
            ],
        });

        if (existingMembership) {
            let errorMessage = "Erro: ";
            if (existingMembership.cpf === formData.cpf)
                errorMessage += "CPF já cadastrado. ";
            if (existingMembership.registration === formData.registration)
                errorMessage += "Matrícula já cadastrada. ";
            if (existingMembership.email === formData.email)
                errorMessage += "Email já cadastrado. ";
            if (existingMembership.rg === formData.rg)
                errorMessage += "RG já cadastrado. ";

            return res.status(777).json({ erro: errorMessage.trim() });
        }

        const membership = new User(formData);

        await membership.save();
        return res.status(201).send(membership);
    } catch (error) {
        console.error("Erro ao criar formulário de membro:", error);
        return res.status(888).send({ error });
    }
};

const getMembershipForm = async (req, res) => {
    try {
        const membership = await User.find({ role: null });
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const deleteMembershipForm = async (req, res) => {
    try {
        const membership = await User.findByIdAndDelete(req.params.id);
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
        const membership = await User.findById(req.params.id);
        if (!membership) {
            return res.status(404).send({ error });
        }
        membership.status = !membership.status;

        const temp_pass = generator.generate({
            length: 8,
            numbers: true,
        });

        const user = new User({
            _id: membership._id,
            name: membership.name,
            email: membership.email,
            phone: membership.cellPhone,
            password: temp_pass,
            status: true,
        });

        user.password = bcrypt.hashSync(temp_pass, salt);

        const filiedUser = await user.save();

        console.log("filied: ", filiedUser);

        if (!filiedUser) {
            console.log("errei");
        }

        await membership.save();

        const bodyEmail = `Olá ${membership.name},
        <br /><br />
        É um prazer tê-la conosco. O Sentinela oferece uma experiência única em gestão sindical, com suporte e atendimento personalizados.
        <br />
        Para criar uma senha de acesso ao sistema clique: <a href="${url}">Link</a>
        <br /><br />
        Caso tenha dúvidas sobre o acesso à sua conta ou outras questões, entre em contato com nossa equipe de Suporte através do e-mail 
        suporte@sentinela.sindpol.org.br ou pelo telefone (61) 3321-1949. Estamos disponíveis de segunda a sexta-feira
        , das 8h às 12h e das 14h às 18h no horário de Brasília.
        `;

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

module.exports = {
    createMembershipForm,
    getMembershipForm,
    deleteMembershipForm,
    updateStatusMembership,
};
