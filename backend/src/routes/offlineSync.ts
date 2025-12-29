import express from 'express';
import { syncOfflineData, getSyncStatus } from '../controllers/offlineSyncController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/sync', authenticate, syncOfflineData);
router.get('/status', authenticate, getSyncStatus);

export default router;

