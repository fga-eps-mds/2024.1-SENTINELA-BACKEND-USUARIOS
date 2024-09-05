const express = require("express");
const routes = express.Router();
const UserController = require("./Controllers/userController");
const RoleController = require("./Controllers/roleController");

const { tokenValidation } = require("./Utils/token");
const { checkPermissions } = require("./Utils/permissions");

const MembershipForm = require("./Controllers/membershipController");
const TokenController = require("./Controllers/tokenController");
const OrganController = require("./Controllers/organController");

//// Private Routes
// --user
routes.get("/users", tokenValidation, UserController.getUsers);
routes.get("/users/:id", tokenValidation, UserController.getUserById);
routes.patch(
    "/users/patch/:id",
    checkPermissions,
    tokenValidation,
    UserController.patchUser
);
routes.delete(
    "/users/delete/:id",
    checkPermissions,
    tokenValidation,
    UserController.deleteUser
);

// --roles
routes.post("/role/create", checkPermissions, RoleController.createRole);
routes.get("/role", RoleController.getAllRoles);
routes.get("/role/:id", RoleController.getRoleById);
routes.patch(
    "/role/patch/:id",
    checkPermissions,
    RoleController.updateRoleById
);
routes.delete(
    "/role/delete/:id",
    checkPermissions,
    RoleController.deleteRoleById
);

// --organ
routes.post("/organ/create", checkPermissions, OrganController.createOrgan);
routes.get("/organ/list", OrganController.listOrgans);
routes.patch(
    "/organ/update/:id",
    checkPermissions,
    OrganController.updateOrgan
);
routes.get("/organ/get/:id", OrganController.getOrganById);
routes.delete(
    "/organ/delete/:id",
    checkPermissions,
    OrganController.deleteOrganById
);

//// Public Routes (No token required)
// --user and memberShip
routes.post("/signup", UserController.signUp);
routes.post("/login", UserController.login);
routes.post("/users/recover-password", UserController.recoverPassword);
routes.post("/verify-token", TokenController.getToken);
routes.patch("/users/change-password/:id", UserController.changePassword);
//
routes.post("/membership/create", MembershipForm.createMembershipForm);
routes.get("/membership", MembershipForm.getMembershipForm);
routes.delete("/membership/delete/:id", MembershipForm.deleteMembershipForm);
routes.patch(
    "/membership/updateStatus/:id",
    MembershipForm.updateStatusMembership
);
routes.patch("/membership/update/:id", MembershipForm.updateMembership);
routes.get("/membership/:id", MembershipForm.getMembershipById);

// --permissions
routes.get("/users/:id/permission", UserController.hasPermission); // exemplo rota: ${baseURL}/users/1278hdfj1238j198189j/permission?moduleName=finance&action=read

module.exports = routes;
