"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const researchController_1 = require("../controllers/researchController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Research Topics
router.post('/topics/generate', researchController_1.generateResearchTopic);
router.post('/topics', researchController_1.createResearchTopic);
router.get('/topics', researchController_1.getResearchTopics);
// Proposals
router.post('/proposals', researchController_1.createProposal);
router.get('/proposals', researchController_1.getProposals);
router.put('/proposals/:id', researchController_1.updateProposal);
// Resource Library
router.post('/resources', researchController_1.createResource);
router.get('/resources', researchController_1.getResources);
// Supervisor Connect
router.post('/supervisors/request', researchController_1.requestSupervisor);
router.get('/supervisors/requests', researchController_1.getSupervisorRequests);
router.put('/supervisors/requests/:id/respond', researchController_1.respondToSupervisorRequest);
// Submission Tracker (Milestones)
router.post('/milestones', researchController_1.createMilestone);
router.get('/milestones/:proposalId', researchController_1.getMilestones);
router.put('/milestones/:id', researchController_1.updateMilestone);
// Collaboration Tools
router.post('/collaborations', researchController_1.createCollaboration);
router.get('/collaborations', researchController_1.getCollaborations);
router.put('/collaborations/:id', researchController_1.updateCollaboration);
router.delete('/collaborations/:id', researchController_1.deleteCollaboration);
exports.default = router;
//# sourceMappingURL=research.js.map