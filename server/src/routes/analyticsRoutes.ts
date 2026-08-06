import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken as any, getAnalytics);

export default router;
