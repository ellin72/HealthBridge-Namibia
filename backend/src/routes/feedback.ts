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
router.get('/', authenticate, getFeedback);
router.get('/stats', authenticate, getFeedbackStats);
router.get('/:id', authenticate, getFeedbackById);
router.patch('/:id/status', authenticate, updateFeedbackStatus);

export default router;

