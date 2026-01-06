"use strict";
/**
 * Feedback Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public route (users can submit feedback without auth)
router.post('/', feedbackController_1.submitFeedback);
// Protected routes
// IMPORTANT: Specific routes must come before general and dynamic routes to ensure correct matching
router.get('/stats', auth_1.authenticate, feedbackController_1.getFeedbackStats); // Specific route must come before general /
router.get('/', auth_1.authenticate, feedbackController_1.getFeedback); // General route
router.get('/:id', auth_1.authenticate, feedbackController_1.getFeedbackById); // Dynamic route must come last
router.patch('/:id/status', auth_1.authenticate, feedbackController_1.updateFeedbackStatus);
exports.default = router;
//# sourceMappingURL=feedback.js.map