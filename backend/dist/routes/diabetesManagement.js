"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const diabetesManagementController_1 = require("../controllers/diabetesManagementController");
const router = express_1.default.Router();
router.post('/programs', auth_1.authenticate, diabetesManagementController_1.createDiabetesProgram);
router.get('/programs', auth_1.authenticate, diabetesManagementController_1.getDiabetesPrograms);
// IMPORTANT: /programs/:id/statistics must come before /programs/:id to prevent /programs/:id from matching /programs/:id/statistics
router.get('/programs/:id/statistics', auth_1.authenticate, diabetesManagementController_1.getGlucoseStatistics);
router.get('/programs/:id', auth_1.authenticate, diabetesManagementController_1.getDiabetesProgramById);
router.put('/programs/:id', auth_1.authenticate, diabetesManagementController_1.updateDiabetesProgram);
router.post('/glucose-readings', auth_1.authenticate, diabetesManagementController_1.addGlucoseReading);
router.get('/glucose-readings', auth_1.authenticate, diabetesManagementController_1.getGlucoseReadings);
router.post('/medication-logs', auth_1.authenticate, diabetesManagementController_1.addMedicationLog);
exports.default = router;
//# sourceMappingURL=diabetesManagement.js.map