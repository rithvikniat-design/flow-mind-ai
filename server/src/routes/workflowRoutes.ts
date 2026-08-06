import { Router } from 'express';
import { getWorkflows, saveWorkflow } from '../controllers/workflowController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getWorkflows);
router.post('/', saveWorkflow);

export default router;
