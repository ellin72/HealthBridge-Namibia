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

// Public routes
router.get('/active/:policyType', getActivePolicy);

// Protected routes (require authentication)
// IMPORTANT: Specific routes must come before dynamic routes to ensure correct matching
router.post('/', authenticate, createPolicy);
router.get('/', authenticate, getPolicies);
router.get('/:id', authenticate, getPolicyById); // Dynamic route must come last
router.patch('/:id', authenticate, updatePolicy);

export default router;

