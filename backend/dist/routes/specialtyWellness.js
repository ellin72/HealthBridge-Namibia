"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const specialtyWellnessController_1 = require("../controllers/specialtyWellnessController");
const router = express_1.default.Router();
// Specialty consultation routes
router.post('/consultations', auth_1.authenticate, specialtyWellnessController_1.createSpecialtyConsultation);
router.get('/consultations', auth_1.authenticate, specialtyWellnessController_1.getSpecialtyConsultations);
router.get('/consultations/:id', auth_1.authenticate, specialtyWellnessController_1.getSpecialtyConsultationById);
router.put('/consultations/:id', auth_1.authenticate, specialtyWellnessController_1.updateSpecialtyConsultation);
// Sleep program routes
router.post('/sleep/programs', auth_1.authenticate, specialtyWellnessController_1.createSleepProgram);
router.get('/sleep/programs', auth_1.authenticate, specialtyWellnessController_1.getSleepPrograms);
// IMPORTANT: /sleep/programs/:id/statistics must come before /sleep/programs/:id to prevent /sleep/programs/:id from matching /sleep/programs/:id/statistics
router.get('/sleep/programs/:id/statistics', auth_1.authenticate, specialtyWellnessController_1.getSleepStatistics);
router.get('/sleep/programs/:id', auth_1.authenticate, specialtyWellnessController_1.getSleepProgramById);
router.post('/sleep/logs', auth_1.authenticate, specialtyWellnessController_1.addSleepLog);
router.get('/sleep/logs', auth_1.authenticate, specialtyWellnessController_1.getSleepLogs);
exports.default = router;
//# sourceMappingURL=specialtyWellness.js.map