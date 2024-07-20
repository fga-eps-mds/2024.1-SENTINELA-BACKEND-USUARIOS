const MembershipForm = require('../Models/membershipFormSchema');

const validateCPF = (cpf) => {
    // Implementar a função de validação de CPF aqui
    // Retornar true se o CPF for válido, false caso contrário
    return true; // Placeholder, substituir com a lógica correta
};

const createMembershipForm = async (req, res) => {
    try {
        console.log("Recebido body da requisição:", req.body);

        if (typeof req.body.nomeCompleto !== 'string' || req.body.nomeCompleto === '') {
            console.log("Nome Completo inválido");
            return res.status(400).json({ erro: "Nome Completo deve ser uma string" });
        }

        const tiposSanguineosValidos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!tiposSanguineosValidos.includes(req.body.tipoSanguineo)) {
            console.log("Tipo Sanguíneo inválido");
            return res.status(400).json({ erro: "Tipo Sanguíneo inválido" });
        }
        
        if (typeof req.body.matricula !== 'string' || req.body.matricula === '') {
            console.log("Matrícula inválida");
            return res.status(400).json({ erro: "Matrícula deve ser uma string" });
        }

        if (!req.body.dataDeNascimento || isNaN(new Date(req.body.dataDeNascimento).getTime())) {
            console.log("Data de Nascimento inválida");
            return res.status(400).json({ erro: "Data de Nascimento inválida" });
        }

        const sexosValidos = ['Masculino', 'Feminino', 'Outro'];
        if (!sexosValidos.includes(req.body.sexo)) {
            console.log("Sexo inválido");
            return res.status(400).json({ erro: "Sexo inválido" });
        }

        if (typeof req.body.naturalidade !== 'string' || req.body.naturalidade === '') {
            console.log("Naturalidade inválida");
            return res.status(400).json({ erro: "Naturalidade deve ser uma string" });
        }

        const ufsValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
        if (!ufsValidos.includes(req.body.uf_naturalidade)) {
            console.log("UF inválida");
            return res.status(400).json({ erro: "UF inválida" });
        }

        const estadosCivisValidos = ['Solteiro', 'Casado', 'Separado', 'Viúvo'];
        if (!estadosCivisValidos.includes(req.body.estadoCivil)) {
            console.log("Estado Civil inválido");
            return res.status(400).json({ erro: "Estado Civil inválido" });
        }

        if (!validateCPF(req.body.cpf)) {
            console.log("CPF inválido");
            return res.status(400).json({ erro: "CPF inválido" });
        }
        const cargoValidos = ['Advogado', 'Agente', 'Técnico Administrativo'];
        if (!cargoValidos.includes(req.body.cargo)) {
            console.log("Cargo inválido");
            return res.status(400).json({ erro: "Cargo inválido" });
        }
        const existingMembership = await MembershipForm.findOne({
            $or: [
                { cpf: req.body.cpf },
                { matricula: req.body.matricula },
                { email: req.body.email }
            ]
        });

        if (existingMembership) {
            let errorMessage = 'Erro: ';
            if (existingMembership.cpf === req.body.cpf) errorMessage += 'CPF já cadastrado. ';
            if (existingMembership.matricula === req.body.matricula) errorMessage += 'Matrícula já cadastrada. ';
            if (existingMembership.email === req.body.email) errorMessage += 'Email já cadastrado. ';
            return res.status(400).json({ erro: errorMessage.trim() });
        }

        console.log("Validações concluídas com sucesso");

        const membership = new MembershipForm(req.body);
        await membership.save();
        console.log("Formulário de membro criado com sucesso:", membership);
        return res.status(201).send(membership);
    } catch (error) {
        console.error("Erro ao criar formulário de membro:", error);
        return res.status(400).send({ error: "Erro ao criar formulário de membro" });
    }
};

const getMembershipForm = async (req, res) => {
    try {
        const membership = await MembershipForm.find({});
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error: "Erro ao buscar formulários de membros" });
    }
};
const deleteMembershipForm = async (req, res) => {
    try {
        const membership = await MembershipForm.findByIdAndDelete(req.params.id);
        if (!membership) {
            return res.status(404).send({ error: "Formulário de membro não encontrado" });
        }
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send({ error: "Erro ao deletar formulário de membro" });
    }
};

module.exports = {
    createMembershipForm,
    getMembershipForm,
    deleteMembershipForm
};
