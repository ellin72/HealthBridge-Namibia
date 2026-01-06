import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPrimaryCareRecord,
  getPrimaryCareRecords,
  getPrimaryCareRecordById,
  updatePrimaryCareRecord,
  getPrimaryCareSummary,
} from '../controllers/primaryCareController';

const router = express.Router();

router.post('/records', authenticate, createPrimaryCareRecord);
router.get('/records', authenticate, getPrimaryCareRecords);
router.get('/records/:id', authenticate, getPrimaryCareRecordById);
router.put('/records/:id', authenticate, updatePrimaryCareRecord);
router.get('/summary', authenticate, getPrimaryCareSummary);

export default router;

