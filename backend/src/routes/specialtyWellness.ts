import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createSpecialtyConsultation,
  getSpecialtyConsultations,
  getSpecialtyConsultationById,
  updateSpecialtyConsultation,
  createSleepProgram,
  getSleepPrograms,
  getSleepProgramById,
  addSleepLog,
  getSleepLogs,
  getSleepStatistics,
} from '../controllers/specialtyWellnessController';

const router = express.Router();

// Specialty consultation routes
router.post('/consultations', authenticate, createSpecialtyConsultation);
router.get('/consultations', authenticate, getSpecialtyConsultations);
router.get('/consultations/:id', authenticate, getSpecialtyConsultationById);
router.put('/consultations/:id', authenticate, updateSpecialtyConsultation);

// Sleep program routes
router.post('/sleep/programs', authenticate, createSleepProgram);
router.get('/sleep/programs', authenticate, getSleepPrograms);
// IMPORTANT: /sleep/programs/:id/statistics must come before /sleep/programs/:id to prevent /sleep/programs/:id from matching /sleep/programs/:id/statistics
router.get('/sleep/programs/:id/statistics', authenticate, getSleepStatistics);
router.get('/sleep/programs/:id', authenticate, getSleepProgramById);

router.post('/sleep/logs', authenticate, addSleepLog);
router.get('/sleep/logs', authenticate, getSleepLogs);

export default router;

