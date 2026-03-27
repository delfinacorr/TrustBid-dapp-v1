import { Router } from 'express';
import { 
  getSubWalletsByProject, 
  createSubWallet, 
  updateSubWallet, 
  deleteSubWallet 
} from '../controllers/subWalletController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Rutas anidadas bajo /api/projects/:projectId/subwallets 
// (Se configuran desde la propia app principal usando mergeParams, pero para esta app usaremos el param explícito)
router.get('/project/:projectId', getSubWalletsByProject);
router.post('/project/:projectId', roleMiddleware(['admin', 'pm']), createSubWallet);

// Rutas directas bajo /api/subwallets/:id
router.put('/:id', roleMiddleware(['admin', 'pm']), updateSubWallet);
router.delete('/:id', roleMiddleware(['admin']), deleteSubWallet);

export default router;
