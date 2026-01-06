"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const hypertensionManagementController_1 = require("../controllers/hypertensionManagementController");
const router = express_1.default.Router();
router.post('/programs', auth_1.authenticate, hypertensionManagementController_1.createHypertensionProgram);
router.get('/programs', auth_1.authenticate, hypertensionManagementController_1.getHypertensionPrograms);
// IMPORTANT: /programs/:id/statistics must come before /programs/:id to prevent /programs/:id from matching /programs/:id/statistics
router.get('/programs/:id/statistics', auth_1.authenticate, hypertensionManagementController_1.getBloodPressureStatistics);
router.get('/programs/:id', auth_1.authenticate, hypertensionManagementController_1.getHypertensionProgramById);
router.put('/programs/:id', auth_1.authenticate, hypertensionManagementController_1.updateHypertensionProgram);
router.post('/bp-readings', auth_1.authenticate, hypertensionManagementController_1.addBloodPressureReading);
router.get('/bp-readings', auth_1.authenticate, hypertensionManagementController_1.getBloodPressureReadings);
router.post('/medication-logs', auth_1.authenticate, hypertensionManagementController_1.addMedicationLog);
exports.default = router;
//# sourceMappingURL=hypertensionManagement.js.map