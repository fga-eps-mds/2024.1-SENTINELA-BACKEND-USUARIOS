const MembershipForm = require('../Models/membershipFormSchema');

const createMembershipForm = async (req, res) => {
    try {
        console.log(req.body);

        if (typeof req.body.nomeCompleto !== 'string' || req.body.nomeCompleto === '') {
            return res.status(400).json({ erro: "Nome Completo deve ser uma string" });
        }

        const tiposSanguineosValidos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!tiposSanguineosValidos.includes(req.body.tipoSanguineo)) {
            return res.status(400).json({ erro: "Tipo Sanguíneo inválido" });
        }
        
        if (typeof req.body.matricula !== 'string' || req.body.matricula === '') {
            return res.status(400).json({ erro: "Matrícula deve ser uma string" });
        }
        if (!req.body.dataDeNascimento || isNaN(new Date(req.body.dataDeNascimento).getTime())) {
            return res.status(400).json({ erro: "Data de Nascimento inválida" });
        }
        const sexosValidos = ['Masculino', 'Feminino', 'Outro'];
        if (!sexosValidos.includes(req.body.sexo)) {
            return res.status(400).json({ erro: "Sexo inválido" });
        } 
        if (typeof req.body.naturalidade !== 'string' || req.body.naturalidade === '') {
            return res.status(400).json({ erro: "Naturalidade deve ser uma string" });
        }
        const ufsValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
        if (!ufsValidos.includes(req.body.uf_naturalidade)) {
            return res.status(400).json({ erro: "UF inválida" });
        }
        const estadosCivisValidos = ['Solteiro', 'Casado', 'Separado', 'Viúvo'];
        if (!estadosCivisValidos.includes(req.body.estadoCivil)) {
            return res.status(400).json({ erro: "Estado Civil inválido" });
        }
        

        const membership = new MembershipForm(req.body);
        await membership.save();
        return res.status(201).send(membership);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const getMembershipForm = async (req, res) => {
    try {
        const membership = await MembershipForm.find({});
        return res.status(200).send(membership);
    } catch (error) {
        return res.status(400).send(error);
    }
};

module.exports = {
    createMembershipForm,
    getMembershipForm
};
