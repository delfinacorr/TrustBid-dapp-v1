import { Router } from 'express';
import { 
  getTransactionsBySubWallet, 
  createTransaction 
} from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Rutas anidadas bajo /api/subwallets/:subWalletId/transactions
router.get('/:subWalletId/transactions', roleMiddleware(['admin', 'pm', 'auditor']), getTransactionsBySubWallet);
router.post('/:subWalletId/transactions', roleMiddleware(['admin', 'pm']), createTransaction);

export default router;
