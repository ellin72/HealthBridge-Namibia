import express from 'express';
import {
  createConsultationNote,
  getConsultationNotes,
  getConsultationNoteById,
  updateConsultationNote
} from '../controllers/consultationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createConsultationNote);
router.get('/', getConsultationNotes);
router.get('/:id', getConsultationNoteById);
router.put('/:id', updateConsultationNote);

export default router;

