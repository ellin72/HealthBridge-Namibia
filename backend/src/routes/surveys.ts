/**
 * Survey Routes
 */

import express from 'express';
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  getPublicSurveyById,
  submitSurveyResponse,
  getSurveyResponses,
  getAdoptionMetrics,
  updateSurveyStatus
} from '../controllers/surveyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (must come before dynamic protected routes to ensure correct matching)
// Note: /public/:id is a two-segment route, but should come before /:id to avoid any potential conflicts
// CRITICAL: Public route uses getPublicSurveyById which validates survey is ACTIVE
router.get('/public/:id', getPublicSurveyById);
router.post('/public/:id/responses', submitSurveyResponse);

// Protected routes (require authentication)
// 
// CRITICAL: Route order matters in Express - routes are matched sequentially
// Static routes with specific paths MUST come before dynamic routes
// Order: static routes -> routes with static prefixes -> dynamic routes with suffixes -> fully dynamic routes
router.post('/', authenticate, createSurvey);
router.get('/', authenticate, getSurveys);
// Fully static route - MUST come before /:id to prevent /metrics/adoption from matching /:id
router.get('/metrics/adoption', authenticate, getAdoptionMetrics);
// Dynamic route with static suffix - more specific than /:id, so comes before it
router.get('/:id/responses', authenticate, getSurveyResponses);
// Fully dynamic route - MUST come last to avoid intercepting static routes
router.get('/:id', authenticate, getSurveyById);
router.patch('/:id/status', authenticate, updateSurveyStatus);

export default router;

