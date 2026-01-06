import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createHypertensionProgram,
  getHypertensionPrograms,
  getHypertensionProgramById,
  updateHypertensionProgram,
  addBloodPressureReading,
  getBloodPressureReadings,
  addMedicationLog,
  getBloodPressureStatistics,
} from '../controllers/hypertensionManagementController';

const router = express.Router();

router.post('/programs', authenticate, createHypertensionProgram);
router.get('/programs', authenticate, getHypertensionPrograms);
// IMPORTANT: /programs/:id/statistics must come before /programs/:id to prevent /programs/:id from matching /programs/:id/statistics
router.get('/programs/:id/statistics', authenticate, getBloodPressureStatistics);
router.get('/programs/:id', authenticate, getHypertensionProgramById);
router.put('/programs/:id', authenticate, updateHypertensionProgram);

router.post('/bp-readings', authenticate, addBloodPressureReading);
router.get('/bp-readings', authenticate, getBloodPressureReadings);

router.post('/medication-logs', authenticate, addMedicationLog);

export default router;

