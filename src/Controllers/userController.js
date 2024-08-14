const User = require("../Models/userSchema");

const bcrypt = require("bcryptjs");
const {
    generateToken,
    generateRecoveryPasswordToken,
} = require("../Utils/token");
const { sendEmail } = require("../Utils/email");
const generator = require("generate-password");
const { checkPermissions } = require("../Utils/permissions");
const Token = require("../Models/tokenSchema");

const salt = bcrypt.genSaltSync();

const signUp = async (req, res) => {
    try {
        const user = new User(req.body);

        const temp_pass = generator.generate({
            length: 8,
            numbers: true,
        });

        user.password = bcrypt.hashSync(temp_pass, salt);

        await user.save();

        const token = generateRecoveryPasswordToken(user._id);

        await Token.findOneAndDelete({ email: user.email });

        const newToken = new Token({ token: token, email: user.email });
        await newToken.save();

        let url;
        if (process.env.NODE_ENV === "deployment") {
            url = `https://seu-dominio.com/trocar-senha/${token}`;
        } else {
            url = `http://localhost:5173/trocar-senha/${token}`;
        }

        if (process.env.NODE_ENV !== "test") {
            const bodyEmail = `Olá ${user.name},
            <br /><br />
            É um prazer tê-la conosco. O Sentinela oferece uma experiência única em gestão sindical, com suporte e atendimento personalizados.
            <br />
            sua senha temporária é:
            <br />
            ${temp_pass}
            <br />
            Para criar uma senha de acesso ao sistema clique: <a href="${url}">Link</a>
            <br /><br />
            Caso tenha dúvidas sobre o acesso à sua conta ou outras questões, entre em contato com nossa equipe de Suporte através do e-mail 
            suporte@sentinela.sindpol.org.br ou pelo telefone (61) 3321-1949. Estamos disponíveis de segunda a sexta-feira
            , das 8h às 12h e das 14h às 18h no horário de Brasília.
            `;
            const sended = await sendEmail(
                user.email,
                "Acesso a plataforma Sentinela",
                bodyEmail
            );

            if (!sended) {
                return res.json({ mensagem: "Falha ao enviar email." });
            }
        }

        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email, status: true });

        if (!user) {
            return res.status(400).send({ error: "Email ou senha inválidos." });
        } else if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({ error: "Email ou senha inválidos." });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            token,
            user,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUsers = async (req, res) => {
    try {
        const user = await User.find().populate("role");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("role");
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const patchUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Encontre o usuário pelo ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send();
        }

        // Verifique se o usuário tem permissão para atualizar os dados
        // if (userId !== req.userId) {
        //   return res.status(457).json({
        //     mensagem: 'O token fornecido não tem permissão para finalizar a operação'
        //   });
        // }

        Object.assign(user, req.body.updatedUser);

        user.updatedAt = new Date();

        await user.save();

        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body.data;
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({ mensagem: "Usuário não encontrado." });
        }

        // Gerar o token de recuperação de senha
        const token = generateRecoveryPasswordToken(user._id);

        // Verificar se já existe um token para o email
        await Token.findOneAndDelete({ email });

        // Criar e salvar um novo token
        const newToken = new Token({ token, email });
        await newToken.save();

        let url;
        if (process.env.NODE_ENV === "deployment") {
            url = `https://seu-dominio.com/recuperar-senha/${token}`;
        } else {
            url = `http://localhost:5173/trocar-senha/${token}`;
        }

        const bodyEmail = `
            Acesse o link abaixo para trocar a senha: 
            <br />
            <a href="${url}">Link</a>
        `;
        const sended = await sendEmail(
            user.email,
            "Redefinição de senha",
            bodyEmail
        );

        if (!sended) {
            return res.json({ mensagem: "Falha ao enviar email." });
        }

        return res.json({
            mensagem: "Email enviado com instruções para redefinir sua senha.",
        });
    } catch (err) {
        return res
            .status(500)
            .json({ mensagem: "Erro interno ao processar solicitação.", err });
    }
};

const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "usuário não encontrado" });
        }

        user.password = bcrypt.hashSync(newPassword, salt);

        await user.save();
        await Token.findOneAndDelete({ email: user.email });

        return res.status(200).json({
            mensagem: "senha alterada com sucesso.",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao salvar o usuário",
            error: error.message,
        });
    }
};

const changePasswordInProfile = async (req, res) => {
    const { old_password, new_password } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send();
        }

        if (userId !== req.userId) {
            return res.status(403).json({
                mensagem:
                    "O token fornecido não tem permissão para finalizar a operação",
            });
        }

        if (!bcrypt.compareSync(old_password, user.password)) {
            return res.status(401).json({
                mensagem: "Senha atual incorreta.",
            });
        }

        user.password = bcrypt.hashSync(new_password, salt);
        await user.save();

        return res.status(200).json({
            mensagem: "senha alterada com sucesso.",
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

const hasPermission = async (req, res) => {
    const userId = req.params.id;
    const { moduleName, action } = req.query; // Parâmetros na URL
    try {
        const user = await User.findById(userId);
        if (!user || !user.role) {
            return res.status(404).json({ message: "User or role not found" });
        }

        const permission = await checkPermissions(userId, moduleName, action);

        if (permission) {
            return res.status(200).json({ hasPermission: true });
        } else {
            return res.status(403).json({ hasPermission: false });
        }
    } catch (error) {
        if (error.name === "CastError" && error.path === "_id") {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signUp,
    login,
    getUsers,
    getUserById,
    deleteUser,
    patchUser,
    recoverPassword,
    changePassword,
    changePasswordInProfile,
    hasPermission,
};
