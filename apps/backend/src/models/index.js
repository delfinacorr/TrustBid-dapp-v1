import sequelize from '../config/database.js';
import User from './User.js';
import Project from './Project.js';
import SubWallet from './SubWallet.js';
import Transaction from './Transaction.js';
import Review from './Review.js';

// Un usuario (PM) puede tener múltiples proyectos
User.hasMany(Project, { foreignKey: 'pm_id', as: 'managed_projects' });
Project.belongsTo(User, { foreignKey: 'pm_id', as: 'manager' });

// Un proyecto tiene múltiples SubWallets
Project.hasMany(SubWallet, { foreignKey: 'project_id', as: 'sub_wallets', onDelete: 'CASCADE' });
SubWallet.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// Un SubWallet tiene múltiples transacciones
SubWallet.hasMany(Transaction, { foreignKey: 'sub_wallet_id', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(SubWallet, { foreignKey: 'sub_wallet_id', as: 'sub_wallet' });

// Un proyecto tiene múltiples Reviews
Project.hasMany(Review, { foreignKey: 'project_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// Un usuario (Auditor) hace múltiples Reviews
User.hasMany(Review, { foreignKey: 'auditor_id', as: 'authored_reviews' });
Review.belongsTo(User, { foreignKey: 'auditor_id', as: 'auditor' });

export {
  sequelize,
  User,
  Project,
  SubWallet,
  Transaction,
  Review
};
