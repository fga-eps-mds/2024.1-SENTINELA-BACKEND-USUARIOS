const express = require('express');

const routes = express.Router();
const UserController = require('./Controllers/userController');

routes.get('/users', UserController.getUsers);
routes.get('/users/:id', UserController.getUserById);
routes.post('/signup', UserController.signUp);
routes.post('/login', UserController.login);
routes.patch('/users/patch/:id', UserController.patchUser);
routes.delete('/users/delete/:id', UserController.deleteUser);

module.exports = routes;