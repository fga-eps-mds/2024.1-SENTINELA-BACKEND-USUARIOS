const Role = require("../Models/roleSchema");
const User = require("../Models/userSchema");

async function checkPermissions(userId, moduleName, action) {
    const user = await User.findById(userId);
    if (!user || !user.role) {
        return false;
    }

    const role = await Role.findById(user.role);
    const permission = role.permissions.find((p) => p.module === moduleName);

    return permission && permission.access.includes(action);
}

module.exports = { checkPermissions };
