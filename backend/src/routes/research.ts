import express from 'express';
import {
  generateResearchTopic,
  createResearchTopic,
  getResearchTopics,
  createProposal,
  getProposals,
  updateProposal,
  createResource,
  getResources,
  requestSupervisor,
  getSupervisorRequests,
  respondToSupervisorRequest,
  createMilestone,
  getMilestones,
  updateMilestone,
  createCollaboration,
  getCollaborations,
  updateCollaboration,
  deleteCollaboration
} from '../controllers/researchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Research Topics
router.post('/topics/generate', generateResearchTopic);
router.post('/topics', createResearchTopic);
router.get('/topics', getResearchTopics);

// Proposals
router.post('/proposals', createProposal);
router.get('/proposals', getProposals);
router.put('/proposals/:id', updateProposal);

// Resource Library
router.post('/resources', createResource);
router.get('/resources', getResources);

// Supervisor Connect
router.post('/supervisors/request', requestSupervisor);
router.get('/supervisors/requests', getSupervisorRequests);
router.put('/supervisors/requests/:id/respond', respondToSupervisorRequest);

// Submission Tracker (Milestones)
router.post('/milestones', createMilestone);
router.get('/milestones/:proposalId', getMilestones);
router.put('/milestones/:id', updateMilestone);

// Collaboration Tools
router.post('/collaborations', createCollaboration);
router.get('/collaborations', getCollaborations);
router.put('/collaborations/:id', updateCollaboration);
router.delete('/collaborations/:id', deleteCollaboration);

export default router;

