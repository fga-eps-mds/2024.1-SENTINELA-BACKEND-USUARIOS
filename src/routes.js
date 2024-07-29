const express = require("express");
const routes = express.Router();
const UserController = require("./Controllers/userController");
const RoleController = require("./Controllers/roleController");
const { tokenValidation } = require("./Utils/token");

// Private Routes
// --user
routes.get("/users", tokenValidation, UserController.getUsers);
routes.get("/users/:id", tokenValidation, UserController.getUserById);
routes.patch("/users/patch/:id", tokenValidation, UserController.patchUser);
routes.delete("/users/delete/:id", tokenValidation, UserController.deleteUser);
routes.patch(
    "/users/change-password/:id",
    tokenValidation,
    UserController.changePassword
);

// --roles
routes.post("/role/create", RoleController.createRole);
routes.get("/role", RoleController.getAllRoles);
routes.get("/role/:id", RoleController.getRoleById);
routes.patch("/role/patch/:id", RoleController.updateRoleById);
routes.delete("/role/delete/:id", RoleController.deleteRoleById);

// --permissions
routes.get("/users/:id/permission", UserController.hasPermission); // exemplo rota: ${baseURL}/users/1278hdfj1238j198189j/permission?moduleName=finance&action=read

// Public Routes (No token required)
// --user
routes.post("/signup", UserController.signUp);
routes.post("/login", UserController.login);
routes.post("/users/recover-password", UserController.recoverPassword);

module.exports = routes;
