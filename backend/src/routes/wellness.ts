import express from 'express';
import {
  createWellnessContent,
  getWellnessContent,
  getWellnessContentById,
  updateWellnessContent,
  deleteWellnessContent
} from '../controllers/wellnessController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createWellnessContent);
router.get('/', getWellnessContent);
router.get('/:id', getWellnessContentById);
router.put('/:id', updateWellnessContent);
router.delete('/:id', deleteWellnessContent);

export default router;

