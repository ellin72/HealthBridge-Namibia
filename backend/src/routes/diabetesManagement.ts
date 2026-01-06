import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createDiabetesProgram,
  getDiabetesPrograms,
  getDiabetesProgramById,
  updateDiabetesProgram,
  addGlucoseReading,
  getGlucoseReadings,
  addMedicationLog,
  getGlucoseStatistics,
} from '../controllers/diabetesManagementController';

const router = express.Router();

router.post('/programs', authenticate, createDiabetesProgram);
router.get('/programs', authenticate, getDiabetesPrograms);
// IMPORTANT: /programs/:id/statistics must come before /programs/:id to prevent /programs/:id from matching /programs/:id/statistics
router.get('/programs/:id/statistics', authenticate, getGlucoseStatistics);
router.get('/programs/:id', authenticate, getDiabetesProgramById);
router.put('/programs/:id', authenticate, updateDiabetesProgram);

router.post('/glucose-readings', authenticate, addGlucoseReading);
router.get('/glucose-readings', authenticate, getGlucoseReadings);

router.post('/medication-logs', authenticate, addMedicationLog);

export default router;

