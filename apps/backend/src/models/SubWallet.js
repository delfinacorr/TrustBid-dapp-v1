import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SubWallet = sequelize.define('SubWallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  area_label: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  budget_ceiling: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0,
  },
  current_balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'sub_wallets',
  timestamps: true,
  underscored: true,
});

export default SubWallet;
