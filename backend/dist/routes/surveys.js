"use strict";
/**
 * Survey Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surveyController_1 = require("../controllers/surveyController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes (must come before dynamic protected routes to ensure correct matching)
// Note: /public/:id is a two-segment route, but should come before /:id to avoid any potential conflicts
// CRITICAL: Public route uses getPublicSurveyById which validates survey is ACTIVE
router.get('/public/:id', surveyController_1.getPublicSurveyById);
router.post('/public/:id/responses', surveyController_1.submitSurveyResponse);
// Protected routes (require authentication)
// 
// CRITICAL: Route order matters in Express - routes are matched sequentially
// Static routes with specific paths MUST come before dynamic routes
// Order: static routes -> routes with static prefixes -> dynamic routes with suffixes -> fully dynamic routes
router.post('/', auth_1.authenticate, surveyController_1.createSurvey);
router.get('/', auth_1.authenticate, surveyController_1.getSurveys);
// Fully static route - MUST come before /:id to prevent /metrics/adoption from matching /:id
router.get('/metrics/adoption', auth_1.authenticate, surveyController_1.getAdoptionMetrics);
// Dynamic route with static suffix - more specific than /:id, so comes before it
router.get('/:id/responses', auth_1.authenticate, surveyController_1.getSurveyResponses);
// Fully dynamic route - MUST come last to avoid intercepting static routes
router.get('/:id', auth_1.authenticate, surveyController_1.getSurveyById);
router.patch('/:id/status', auth_1.authenticate, surveyController_1.updateSurveyStatus);
exports.default = router;
//# sourceMappingURL=surveys.js.map