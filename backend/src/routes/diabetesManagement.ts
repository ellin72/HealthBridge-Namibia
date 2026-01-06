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
router.get('/programs/:id', authenticate, getDiabetesProgramById);
router.put('/programs/:id', authenticate, updateDiabetesProgram);

router.post('/glucose-readings', authenticate, addGlucoseReading);
router.get('/glucose-readings', authenticate, getGlucoseReadings);

router.post('/medication-logs', authenticate, addMedicationLog);

router.get('/programs/:id/statistics', authenticate, getGlucoseStatistics);

export default router;

