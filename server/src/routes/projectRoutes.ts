import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  getExecutionLogs,
  getProjectReport
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect all project routes
router.use(authenticateToken as any);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.get('/:projectId/logs', getExecutionLogs);
router.get('/:projectId/report', getProjectReport);

export default router;
