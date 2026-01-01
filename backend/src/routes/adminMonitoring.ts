import express from 'express';
import {
  getTransactionMonitoring,
  getFraudAlerts,
  reconcileTransactions,
} from '../controllers/adminMonitoringController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/transactions', authenticate, authorize(UserRole.ADMIN), getTransactionMonitoring);
router.get('/fraud-alerts', authenticate, authorize(UserRole.ADMIN), getFraudAlerts);
router.post('/reconcile', authenticate, authorize(UserRole.ADMIN), reconcileTransactions);

export default router;

