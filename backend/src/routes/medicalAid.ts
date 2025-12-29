import express from 'express';
import {
  getMedicalAidInfo,
  upsertMedicalAidInfo,
  verifyMedicalAid,
  submitClaim,
  getClaims,
} from '../controllers/medicalAidController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getMedicalAidInfo);
router.post('/', authenticate, upsertMedicalAidInfo);
router.put('/', authenticate, upsertMedicalAidInfo);
router.post('/verify', authenticate, verifyMedicalAid);
router.post('/claims', authenticate, submitClaim);
router.get('/claims', authenticate, getClaims);

export default router;

