import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sub_wallet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sub_wallets',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  concept: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  recipient_hash: {
    type: DataTypes.STRING(66),
    allowNull: true,
    comment: 'Dirección wallet o hash de tx en blockchain',
  },
  tx_type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
});

export default Transaction;
