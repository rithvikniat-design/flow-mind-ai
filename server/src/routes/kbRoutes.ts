import { Router } from 'express';
import { getKbFiles, uploadKbFile, deleteKbFile } from '../controllers/kbController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getKbFiles);
router.post('/upload', uploadKbFile);
router.delete('/:id', deleteKbFile);

export default router;
