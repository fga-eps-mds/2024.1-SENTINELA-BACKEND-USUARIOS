const User = require('../Models/userSchema');
const Role = require('../Models/roleSchema');

const bcrypt = require('bcryptjs');
const { generateToken } = require('../Utils/token');
const { sendEmail } = require('../Utils/email');
const generator = require('generate-password');

const salt = bcrypt.genSaltSync();

const signUp = async (req, res) => {
  try {
    const user = new User(req.body);

    const temp_pass = generator.generate({
      length: 8,
      numbers: true,
    })

    

    user.password = bcrypt.hashSync(temp_pass, salt)

    await user.save();

    const bodyEmail = `
        Bem vindo a equipe Sentinela, sua senha temporária é:
        <br />
        ${temp_pass}
      `;
    const sended = await sendEmail(user.email, 'Acesso a plataforma Sentinela', bodyEmail);

    if (!sended) {
      return res.json({ mensagem: 'Falha ao enviar email.' });
    }

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send({ error: 'Email ou senha inválidos.' });
    } else if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({ error: 'Email ou senha inválidos.' });
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

    // Atualize as propriedades do usuário com os dados fornecidos em req.body
    Object.assign(user, req.body.updatedUser);
    // Atualize a data de atualização
    user.updatedAt = new Date();

    // Salve as alterações no banco de dados
    await user.save();

    // Envie a resposta com o usuário atualizado
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
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // // Gerar token com expiração curta (1 hora)
    // const token = generateToken(user._id); // caso precise...

    const temp_pass = generator.generate({
      length: 6,
      numbers: true
    })

    user.password = bcrypt.hashSync(temp_pass, salt)

    await user.save()

    const bodyEmail = `
        Sua nova senha temporária é:
        <br />
        ${temp_pass}
      `;
    const sended = await sendEmail(user.email, 'Redefinição de senha', bodyEmail);

    if (!sended) {
      return res.json({ mensagem: 'Falha ao enviar email.' });
    }

    return res.json({ mensagem: 'Email enviado com instruções para redefinir sua senha.' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao processar solicitação.' });
  }
};

const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    if (userId !== req.userId) {
      return res.status(403).json({
        mensagem: 'O token fornecido não tem permissão para finalizar a operação'
      })
    }

    if (!bcrypt.compareSync(old_password, user.password)) {
      return res.status(401).json({
        mensagem: 'Senha atual incorreta.'
      })
    }

    user.password = bcrypt.hashSync(new_password, salt)
    await user.save()

    return res.status(200).json({
      mensagem: "senha alterada com sucesso."
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

const hasPermission = async (req, res) => {
  const userId = req.params.id;
  const { moduleName, action } = req.query; // Parâmetros na URL

  try {
    const user = await User.findById(userId).populate('role');
    if (!user || !user.role) {
      return res.status(404).json({ message: 'User or role not found' });
    }

    const role = user.role;
    const permission = role.permissions.find(p => p.module === moduleName);

    if (permission && permission.access.includes(action)) {
      return res.status(200).json({ hasPermission: true });
    } else {
      return res.status(403).json({ hasPermission: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  signUp,
  login,
  getUsers,
  getUserById,
  deleteUser,
  patchUser,
  recoverPassword,
  changePassword,
  hasPermission
};
