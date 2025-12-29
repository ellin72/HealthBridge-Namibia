import express from 'express';
import {
  getMedications,
  createMedication,
  updateMedication,
  logMedication,
  getUpcomingReminders,
} from '../controllers/medicationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getMedications);
router.post('/', authenticate, createMedication);
router.put('/:id', authenticate, updateMedication);
router.post('/log', authenticate, logMedication);
router.get('/upcoming', authenticate, getUpcomingReminders);

export default router;

