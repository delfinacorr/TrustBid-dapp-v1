import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },

  role: {
    type: DataTypes.ENUM('admin', 'pm', 'donor', 'auditor'),
    allowNull: false,
    defaultValue: 'donor',
  },
  wallet_address: {
    type: DataTypes.STRING(42),
    allowNull: true,
    unique: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;
