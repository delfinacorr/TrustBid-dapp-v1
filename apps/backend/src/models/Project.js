import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'closed', 'paused'),
    defaultValue: 'pending',
    allowNull: false,
  },
  total_allocation: {
    type: DataTypes.DECIMAL(18, 8),
    defaultValue: 0,
    allowNull: false,
  },
  pm_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'projects',
  timestamps: true,
  underscored: true,
});

export default Project;
