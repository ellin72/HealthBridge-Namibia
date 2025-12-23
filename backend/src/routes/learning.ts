import express from 'express';
import {
  uploadLearningResource,
  getLearningResources,
  deleteLearningResource,
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  gradeAssignment
} from '../controllers/learningController';
import { authenticate } from '../middleware/auth';
import { uploadSingle } from '../utils/upload';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Learning Resources
router.post('/resources', uploadSingle, uploadLearningResource);
router.get('/resources', getLearningResources);
router.delete('/resources/:id', deleteLearningResource);

// Assignments
router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignmentById);
router.post('/assignments/submit', uploadSingle, submitAssignment);
router.put('/assignments/submissions/:submissionId/grade', gradeAssignment);

export default router;

