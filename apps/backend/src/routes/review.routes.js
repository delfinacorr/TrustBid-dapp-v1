import { Router } from 'express';
import { 
  getReviewsByProject, 
  createReview, 
  updateReview 
} from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Rutas anidadas bajo /api/projects/:projectId/reviews
router.get('/project/:projectId', getReviewsByProject);
router.post('/project/:projectId', roleMiddleware(['auditor', 'admin']), createReview);

// Rutas directas bajo /api/reviews/:id
router.put('/:id', roleMiddleware(['auditor', 'admin']), updateReview);

export default router;
