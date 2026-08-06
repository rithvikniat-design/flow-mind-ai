import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken as any, getMe);

export default router;
