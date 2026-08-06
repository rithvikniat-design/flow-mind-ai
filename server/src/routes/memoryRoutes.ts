import { Router } from 'express';
import { getMemories } from '../controllers/memoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:projectId', authenticateToken as any, getMemories);

export default router;
