"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const telehealthProController_1 = require("../controllers/telehealthProController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Video Consultations
router.post('/video-consultations', telehealthProController_1.createVideoConsultation);
router.get('/video-consultations/:appointmentId', telehealthProController_1.getVideoConsultation);
router.put('/video-consultations/:appointmentId', telehealthProController_1.updateVideoConsultation);
// Patient History
router.post('/patient-history', telehealthProController_1.createPatientHistory);
router.get('/patient-history/:patientId', telehealthProController_1.getPatientHistory);
router.put('/patient-history/:id', telehealthProController_1.updatePatientHistory);
// Provider Analytics
router.get('/analytics', telehealthProController_1.getProviderAnalytics);
exports.default = router;
//# sourceMappingURL=telehealthPro.js.map