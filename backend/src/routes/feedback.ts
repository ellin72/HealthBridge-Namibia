/**
 * Feedback Routes
 */

import express from 'express';
import {
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getFeedbackStats
} from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public route (users can submit feedback without auth)
router.post('/', submitFeedback);

// Protected routes
// IMPORTANT: Specific routes must come before general and dynamic routes to ensure correct matching
router.get('/stats', authenticate, getFeedbackStats); // Specific route must come before general /
router.get('/', authenticate, getFeedback); // General route
router.get('/:id', authenticate, getFeedbackById); // Dynamic route must come last
router.patch('/:id/status', authenticate, updateFeedbackStatus);

export default router;

