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
// IMPORTANT: Specific routes must come before dynamic routes to ensure correct matching
router.get('/', authenticate, getFeedback);
router.get('/stats', authenticate, getFeedbackStats); // Must come before /:id
router.get('/:id', authenticate, getFeedbackById); // Dynamic route must come last
router.patch('/:id/status', authenticate, updateFeedbackStatus);

export default router;

