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

// Public routes
router.get('/public/:id', getSurveyById);
router.post('/public/:id/responses', submitSurveyResponse);

// Protected routes (require authentication)
router.post('/', authenticate, createSurvey);
router.get('/', authenticate, getSurveys);
router.get('/:id', authenticate, getSurveyById);
router.get('/:id/responses', authenticate, getSurveyResponses);
router.get('/metrics/adoption', authenticate, getAdoptionMetrics);
router.patch('/:id/status', authenticate, updateSurveyStatus);

export default router;

