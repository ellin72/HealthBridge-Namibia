import express from 'express';
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  getBillingStats,
} from '../controllers/billingController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', authenticate, getInvoices);
router.get('/stats', authenticate, getBillingStats);
router.post('/', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), createInvoice);
router.put('/:id', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), updateInvoice);

export default router;

