import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createUrgentCareRequest,
  getUrgentCareRequests,
  getUrgentCareRequestById,
  updateUrgentCareRequest,
  getAllUrgentCareRequests,
  getUrgentCareStatistics,
} from '../controllers/urgentCareController';

const router = express.Router();

router.post('/requests', authenticate, createUrgentCareRequest);
// IMPORTANT: /requests/all must come before /requests to prevent /requests from matching /requests/all
router.get('/requests/all', authenticate, getAllUrgentCareRequests);
router.get('/requests', authenticate, getUrgentCareRequests);
router.get('/requests/:id', authenticate, getUrgentCareRequestById);
router.put('/requests/:id', authenticate, updateUrgentCareRequest);
router.get('/statistics', authenticate, getUrgentCareStatistics);

export default router;

