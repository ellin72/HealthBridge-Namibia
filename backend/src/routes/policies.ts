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
// 
// CRITICAL: Route order matters in Express - routes are matched sequentially
// Static routes with specific paths MUST come before dynamic routes
// Order: static routes -> routes with static prefixes -> fully dynamic routes
router.post('/', authenticate, createPolicy);
router.get('/', authenticate, getPolicies);
// Static prefix route - MUST come before /:id to prevent /active/DATA_RETENTION from matching /:id
router.get('/active/:policyType', authenticate, getActivePolicy);
// Fully dynamic route - MUST come last to avoid intercepting static routes
router.get('/:id', authenticate, getPolicyById);
router.patch('/:id', authenticate, updatePolicy);

export default router;

