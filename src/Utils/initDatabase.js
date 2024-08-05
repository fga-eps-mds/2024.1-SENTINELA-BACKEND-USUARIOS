// ./utils/initRoles.js
const mongoose = require('mongoose');
const Role = require('../Models/roleSchema'); // Ajuste o caminho conforme necessário
const User = require('../Models/userSchema');
const bcrypt = require('bcrypt');

const initializeAdminUser = async () => {
  try {
    // Verificar se a conexão está aberta antes de executar
    if (mongoose.connection.readyState === 1) {
      // Verifica se o usuário administrador já existe
      const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('senha', salt); // Altere a senha padrão conforme necessário

        // Cria o usuário administrador sem a necessidade de uma role predefinida
        const adminUser = new User({
          name: 'Admin',
          email: 'admin@admin.com',
          phone: '1234567890',
          password: hashedPassword,
          // role pode ser atribuída pelo frontend posteriormente
        });

        await adminUser.save();
        console.log('Usuário administrador criado com sucesso.');
      } else {
        console.log('Usuário administrador já existe.');
      }
    } else {
      console.error('Mongoose connection is not open');
    }
  } catch (err) {
    console.error('Error initializing admin user:', err);
  }
};

module.exports = initializeAdminUser;