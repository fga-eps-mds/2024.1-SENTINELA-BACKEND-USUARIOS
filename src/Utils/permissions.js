const User = require("../Models/userSchema");

async function hasPermission(userId, moduleName, action) {
    const user = await User.findById(userId).populate("role");
    if (!user || !user.role) {
        return false;
    }

    const role = user.role;
    const permission = role.permissions.find((p) => p.module === moduleName);

    return permission && permission.access.includes(action);
}

module.exports = { hasPermission };
