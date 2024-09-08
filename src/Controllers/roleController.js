const Role = require("../Models/roleSchema");

const createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).send(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRoleById = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRoleById = async (req, res) => {
    try {
        // Encontre a role pelo ID
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Verifique se a role é protegida
        if (role.isProtected) {
            return res
                .status(403)
                .json({ message: "Cannot delete protected role" });
        }

        // Se a role não for protegida, realize a exclusão
        await Role.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRoleById,
    deleteRoleById,
};
