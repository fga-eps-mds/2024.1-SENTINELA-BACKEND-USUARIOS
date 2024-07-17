const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    module: { type: String, required: true },
    access: {
        type: [String],
        required: true,
        enum: ['create', 'read', 'update', 'delete']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
