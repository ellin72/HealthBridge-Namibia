import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createWeightProgram,
  getWeightPrograms,
  getWeightProgramById,
  updateWeightProgram,
  addWeightEntry,
  getWeightEntries,
  getWeightProgress,
} from '../controllers/weightManagementController';

const router = express.Router();

router.post('/programs', authenticate, createWeightProgram);
router.get('/programs', authenticate, getWeightPrograms);
// IMPORTANT: /programs/:id/progress must come before /programs/:id to prevent /programs/:id from matching /programs/:id/progress
router.get('/programs/:id/progress', authenticate, getWeightProgress);
router.get('/programs/:id', authenticate, getWeightProgramById);
router.put('/programs/:id', authenticate, updateWeightProgram);

router.post('/entries', authenticate, addWeightEntry);
router.get('/entries', authenticate, getWeightEntries);

export default router;

