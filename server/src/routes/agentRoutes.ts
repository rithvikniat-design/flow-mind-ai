import { Router } from 'express';
import { getAgents, updateAgent, createAgent } from '../controllers/agentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getAgents);
router.post('/', createAgent);
router.put('/:id', updateAgent);

export default router;
