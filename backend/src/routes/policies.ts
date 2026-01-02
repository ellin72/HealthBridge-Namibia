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

// Protected routes (require authentication)
// Note: getActivePolicy requires authentication to protect sensitive policy information
// IMPORTANT: Specific routes must come before dynamic routes to ensure correct matching
router.post('/', authenticate, createPolicy);
router.get('/', authenticate, getPolicies);
router.get('/active/:policyType', authenticate, getActivePolicy); // Protected route for active policies
router.get('/:id', authenticate, getPolicyById); // Dynamic route must come last
router.patch('/:id', authenticate, updatePolicy);

export default router;

