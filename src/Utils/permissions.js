// const Role = require("../Models/roleSchema");
const User = require("../Models/userSchema");

async function checkPermissions(req, res, next) {
    const userId = req.query?.userId;
    const moduleName = req.query?.moduleName;
    const action = req.query?.action;
    console.log(userId, moduleName, action);
    try {
        const user = await User.findById(userId).populate("role");
        if (!user || !user.role) {
            return false;
        }
        const permission = user.role.permissions.find(
            (p) => p.module === moduleName
        );

        const has = permission && permission.access.includes(action);

        if (!has) {
            return res.status(403).json({
                mensagem: "Usuário não possui permissão.",
            });
        }

        next();
    } catch (err) {
        console.erro(err);
    }
}

module.exports = { checkPermissions };
