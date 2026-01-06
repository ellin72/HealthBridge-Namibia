import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getTherapists,
  getTherapistById,
  createTherapistProfile,
  updateTherapistProfile,
  createTherapySession,
  getPatientTherapySessions,
  updateTherapySession,
  matchTherapist,
  getTherapistMatches,
  updateMatchStatus,
} from '../controllers/mentalHealthController';

const router = express.Router();

// Therapist routes
router.get('/therapists', authenticate, getTherapists);
router.get('/therapists/:id', authenticate, getTherapistById);
router.post('/therapists/profile', authenticate, createTherapistProfile);
router.put('/therapists/profile', authenticate, updateTherapistProfile);

// Therapy session routes
router.post('/sessions', authenticate, createTherapySession);
router.get('/sessions', authenticate, getPatientTherapySessions);
router.put('/sessions/:id', authenticate, updateTherapySession);

// Therapist matching routes
router.post('/matches', authenticate, matchTherapist);
router.get('/matches', authenticate, getTherapistMatches);
router.put('/matches/:id', authenticate, updateMatchStatus);

export default router;

