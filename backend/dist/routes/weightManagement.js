"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const weightManagementController_1 = require("../controllers/weightManagementController");
const router = express_1.default.Router();
router.post('/programs', auth_1.authenticate, weightManagementController_1.createWeightProgram);
router.get('/programs', auth_1.authenticate, weightManagementController_1.getWeightPrograms);
// IMPORTANT: /programs/:id/progress must come before /programs/:id to prevent /programs/:id from matching /programs/:id/progress
router.get('/programs/:id/progress', auth_1.authenticate, weightManagementController_1.getWeightProgress);
router.get('/programs/:id', auth_1.authenticate, weightManagementController_1.getWeightProgramById);
router.put('/programs/:id', auth_1.authenticate, weightManagementController_1.updateWeightProgram);
router.post('/entries', auth_1.authenticate, weightManagementController_1.addWeightEntry);
router.get('/entries', auth_1.authenticate, weightManagementController_1.getWeightEntries);
exports.default = router;
//# sourceMappingURL=weightManagement.js.map