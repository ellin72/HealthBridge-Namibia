import express from 'express';
import {
  createPayment,
  verify2FAAndCompletePayment,
  processPaymentCallback,
  getPayments,
  getPayment,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createPayment);
router.post('/verify-2fa', authenticate, verify2FAAndCompletePayment);
router.post('/callback', processPaymentCallback); // Public endpoint for payment gateway callbacks
router.get('/', authenticate, getPayments);
router.get('/:id', authenticate, getPayment);

export default router;

