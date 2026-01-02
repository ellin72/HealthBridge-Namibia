/**
 * Policy Routes
 */

import express from 'express';
import {
  createPolicy,
  getPolicies,
  getActivePolicy,
  updatePolicy,
  getPolicyById
} from '../controllers/policyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public route - get active policy
router.get('/active/:policyType', getActivePolicy);

// Protected routes
router.post('/', authenticate, createPolicy);
router.get('/', authenticate, getPolicies);
router.get('/:id', authenticate, getPolicyById);
router.patch('/:id', authenticate, updatePolicy);

export default router;

