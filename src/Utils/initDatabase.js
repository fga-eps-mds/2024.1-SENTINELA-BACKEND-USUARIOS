// ./utils/initRoles.js
const mongoose = require('mongoose');
const Role = require('../Models/roleSchema'); // Ajuste o caminho conforme necessário

const initializeRoles = async () => {
  const roles = [
    {
      name: 'administrador',
      permissions: [
        { module: 'users', access: ['create', 'read', 'update', 'delete'] },
        { module: 'finance', access: ['create', 'read', 'update', 'delete'] },
        { module: 'benefits', access: ['create', 'read', 'update', 'delete'] },
        { module: 'juridic', access: ['create', 'read', 'update', 'delete'] },
      ]
    },
    {
      name: 'diretoria',
      permissions: [
        { module: 'finance', access: ['create', 'read', 'update', 'delete'] },
        { module: 'benefits', access: ['create', 'read', 'update', 'delete'] },
        { module: 'juridic', access: ['create', 'read', 'update', 'delete'] },
      ]
    },
    {
      name: 'jurídico',
      permissions: [
        { module: 'juridic', access: ['create', 'read', 'update', 'delete'] },
      ]
    },
    {
      name: 'colaborador',
      permissions: [
        { module: 'benefits', access: ['create', 'read', 'update', 'delete'] },
        { module: 'juridic', access: ['create', 'read', 'update', 'delete'] },
      ]
    }
  ];

  try {
    // Certifique-se de que a conexão está aberta antes de executar
    if (mongoose.connection.readyState === 1) {
      for (const roleData of roles) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (!existingRole) {
          const role = new Role(roleData);
          await role.save();
          console.log(`Role ${roleData.name} created`);
        } else {
          console.log(`Role ${roleData.name} already exists`);
        }
      }
    } else {
      console.error('Mongoose connection is not open');
    }
  } catch (err) {
    console.error('Error initializing roles:', err);
  }
};

module.exports = initializeRoles;
