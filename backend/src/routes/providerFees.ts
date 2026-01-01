import express from 'express';
import {
  getProviderFee,
  updateProviderFee,
  getAllProviderFees,
} from '../controllers/providerFeeController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', authenticate, getProviderFee);
router.get('/all', authenticate, authorize(UserRole.ADMIN), getAllProviderFees);
router.put('/:providerId?', authenticate, updateProviderFee);

export default router;

