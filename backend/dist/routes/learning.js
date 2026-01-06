"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const learningController_1 = require("../controllers/learningController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../utils/upload");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Learning Resources
router.post('/resources', upload_1.uploadSingle, learningController_1.uploadLearningResource);
router.get('/resources', learningController_1.getLearningResources);
router.delete('/resources/:id', learningController_1.deleteLearningResource);
// Assignments
router.post('/assignments', learningController_1.createAssignment);
router.get('/assignments', learningController_1.getAssignments);
router.get('/assignments/:id', learningController_1.getAssignmentById);
router.post('/assignments/submit', upload_1.uploadSingle, learningController_1.submitAssignment);
router.put('/assignments/submissions/:submissionId/grade', learningController_1.gradeAssignment);
exports.default = router;
//# sourceMappingURL=learning.js.map