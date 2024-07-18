const express = require('express');
const routes = express.Router();
const UserController = require('./Controllers/userController');
const { tokenValidation } = require('./Utils/token');
const MembershipForm = require('./Controllers/membershipFormController');

// Private
routes.get('/users', UserController.getUsers);
routes.get('/users/:id', tokenValidation,  UserController.getUserById);
routes.patch('/users/patch/:id', tokenValidation, UserController.patchUser);
routes.delete('/users/delete/:id', tokenValidation, UserController.deleteUser);
routes.patch('/users/change-password/:id', tokenValidation, UserController.changePassword);

// Public
routes.post('/signup', UserController.signUp);
routes.post('/login', UserController.login);
routes.post('/users/recover-password', UserController.recoverPassword);
routes.post('/membership/create', MembershipForm.createMembershipForm);
routes.get('/membership', MembershipForm.getMembershipForm);
module.exports = routes;