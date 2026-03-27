import { Router } from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// Todas requieren autenticación
router.use(authMiddleware);

// Lectura para todos los autenticados (Admin, PM, Donor, Auditor)
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Creación y edición solo para Admin y PM
router.post('/', roleMiddleware(['admin', 'pm']), createProject);
router.put('/:id', roleMiddleware(['admin', 'pm']), updateProject);

// Eliminación solo para Admin
router.delete('/:id', roleMiddleware(['admin']), deleteProject);

export default router;
