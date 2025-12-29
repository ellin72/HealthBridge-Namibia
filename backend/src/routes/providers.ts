import express from 'express';
import { getProviders } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get healthcare providers (accessible to all authenticated users for booking)
router.get('/', getProviders);

export default router;

