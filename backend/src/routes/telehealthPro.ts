import express from 'express';
import {
  createVideoConsultation,
  getVideoConsultation,
  updateVideoConsultation,
  createPatientHistory,
  getPatientHistory,
  updatePatientHistory,
  getProviderAnalytics
} from '../controllers/telehealthProController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Video Consultations
router.post('/video-consultations', createVideoConsultation);
router.get('/video-consultations/:appointmentId', getVideoConsultation);
router.put('/video-consultations/:appointmentId', updateVideoConsultation);

// Patient History
router.post('/patient-history', createPatientHistory);
router.get('/patient-history/:patientId', getPatientHistory);
router.put('/patient-history/:id', updatePatientHistory);

// Provider Analytics
router.get('/analytics', getProviderAnalytics);

export default router;

