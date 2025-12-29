import express from 'express';
import { assessSymptoms, getTriageHistory } from '../controllers/triageController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/assess', authenticate, assessSymptoms);
router.get('/history', authenticate, getTriageHistory);

export default router;

