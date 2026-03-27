import { Transaction, SubWallet } from '../models/index.js';
import sequelize from '../config/database.js';

// GET /api/subwallets/:subWalletId/transactions
export const getTransactionsBySubWallet = async (req, res) => {
  try {
    const { subWalletId } = req.params;
    const transactions = await Transaction.findAll({
      where: { sub_wallet_id: subWalletId },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

// POST /api/subwallets/:subWalletId/transactions
export const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { subWalletId } = req.params;
    const { amount, concept, recipient_hash, tx_type } = req.body;

    const subwallet = await SubWallet.findByPk(subWalletId, { transaction: t });
    if (!subwallet) {
      await t.rollback();
      return res.status(404).json({ error: 'SubWallet no encontrado' });
    }

    // Calcular nuevo balance
    const parsedAmount = parseFloat(amount);
    let newBalance = parseFloat(subwallet.current_balance);
    
    if (tx_type === 'credit') {
      newBalance += parsedAmount;
    } else if (tx_type === 'debit') {
      newBalance -= parsedAmount;
    } else {
      await t.rollback();
      return res.status(400).json({ error: 'Tipo de transacción inválido' });
    }

    // Crear registro de transacción
    const transaction = await Transaction.create({
      sub_wallet_id: subWalletId,
      amount: parsedAmount,
      concept,
      recipient_hash,
      tx_type
    }, { transaction: t });

    // Actualizar balance
    await subwallet.update({ current_balance: newBalance }, { transaction: t });

    await t.commit();
    res.status(201).json({
      transaction,
      new_balance: newBalance
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al procesar la transacción' });
  }
};
