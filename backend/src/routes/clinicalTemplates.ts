import express from 'express';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/clinicalTemplateController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), getTemplates);
router.post('/', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), createTemplate);
router.put('/:id', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), updateTemplate);
router.delete('/:id', authenticate, authorize(UserRole.HEALTHCARE_PROVIDER), deleteTemplate);

export default router;

