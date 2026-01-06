"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wellnessToolsController_1 = require("../controllers/wellnessToolsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Wellness Plans
router.post('/plans', wellnessToolsController_1.createWellnessPlan);
router.get('/plans', wellnessToolsController_1.getWellnessPlans);
router.put('/plans/:id', wellnessToolsController_1.updateWellnessPlan);
router.delete('/plans/:id', wellnessToolsController_1.deleteWellnessPlan);
// Habit Tracking
router.post('/habits', wellnessToolsController_1.createHabitTracker);
router.get('/habits', wellnessToolsController_1.getHabitTrackers);
router.post('/habits/entries', wellnessToolsController_1.addHabitEntry);
router.get('/habits/:habitTrackerId/entries', wellnessToolsController_1.getHabitEntries);
// Community Challenges
router.post('/challenges', wellnessToolsController_1.createChallenge);
router.get('/challenges', wellnessToolsController_1.getChallenges);
router.post('/challenges/:challengeId/join', wellnessToolsController_1.joinChallenge);
router.put('/challenges/:challengeId/progress', wellnessToolsController_1.updateChallengeProgress);
router.get('/challenges/my-challenges', wellnessToolsController_1.getUserChallenges);
exports.default = router;
//# sourceMappingURL=wellnessTools.js.map