"use strict";
/**
 * Policy Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const policyController_1 = require("../controllers/policyController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes (require authentication)
// Note: getActivePolicy requires authentication to protect sensitive policy information
// 
// CRITICAL: Route order matters in Express - routes are matched sequentially
// Static routes with specific paths MUST come before dynamic routes
// Order: static routes -> routes with static prefixes -> fully dynamic routes
router.post('/', auth_1.authenticate, policyController_1.createPolicy);
router.get('/', auth_1.authenticate, policyController_1.getPolicies);
// Static prefix route - MUST come before /:id to prevent /active/DATA_RETENTION from matching /:id
router.get('/active/:policyType', auth_1.authenticate, policyController_1.getActivePolicy);
// Fully dynamic route - MUST come last to avoid intercepting static routes
router.get('/:id', auth_1.authenticate, policyController_1.getPolicyById);
router.patch('/:id', auth_1.authenticate, policyController_1.updatePolicy);
exports.default = router;
//# sourceMappingURL=policies.js.map