import express from 'express';
import {
  getProviderEarnings,
  requestPayout,
  getAllProviderEarnings,
} from '../controllers/providerEarningsController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', authenticate, getProviderEarnings);
router.post('/payout', authenticate, requestPayout);
router.get('/all', authenticate, authorize(UserRole.ADMIN), getAllProviderEarnings);

export default router;

