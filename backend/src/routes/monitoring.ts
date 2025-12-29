import express from 'express';
import {
  getMonitoringData,
  createMonitoringData,
  getMonitoringStats,
} from '../controllers/monitoringController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getMonitoringData);
router.get('/stats', authenticate, getMonitoringStats);
router.post('/', authenticate, createMonitoringData);

export default router;

