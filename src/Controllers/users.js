const express = require('express');
const router = express.Router();
const Usuario = require('../Models/User');

// Criar um novo usuário
router.post('/users', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).send(usuario);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    if (!(password == usuario.password)) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    res.send({ user: usuario });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obter todos os usuários
router.get('/users', async (req, res) => {
  try {
    const user = await Usuario.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obter um usuário por ID
router.get('/users/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).send();
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Atualizar um usuário por ID
router.patch('/users/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!usuario) {
      return res.status(404).send();
    }

    usuario.updatedAt = new Date();

    const updatedUser = await usuario.save();

    res.status(200).send(usuario);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Excluir um usuário por ID
router.delete('/users/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).send();
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
