/**
 * Survey Routes
 */

import express from 'express';
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  submitSurveyResponse,
  getSurveyResponses,
  getAdoptionMetrics,
  updateSurveyStatus
} from '../controllers/surveyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (must come before dynamic protected routes to ensure correct matching)
// Note: /public/:id is a two-segment route, but should come before /:id to avoid any potential conflicts
router.get('/public/:id', getSurveyById);
router.post('/public/:id/responses', submitSurveyResponse);

// Protected routes (require authentication)
// IMPORTANT: Specific routes must come before dynamic routes to ensure correct matching
router.post('/', authenticate, createSurvey);
router.get('/', authenticate, getSurveys);
router.get('/metrics/adoption', authenticate, getAdoptionMetrics); // Must come before /:id
router.get('/:id/responses', authenticate, getSurveyResponses);
router.get('/:id', authenticate, getSurveyById); // Dynamic route must come last
router.patch('/:id/status', authenticate, updateSurveyStatus);

export default router;

