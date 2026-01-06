"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const mentalHealthController_1 = require("../controllers/mentalHealthController");
const router = express_1.default.Router();
// Therapist routes
router.get('/therapists', auth_1.authenticate, mentalHealthController_1.getTherapists);
router.post('/therapists/profile', auth_1.authenticate, mentalHealthController_1.createTherapistProfile);
router.put('/therapists/profile', auth_1.authenticate, mentalHealthController_1.updateTherapistProfile);
router.get('/therapists/:id', auth_1.authenticate, mentalHealthController_1.getTherapistById);
// Therapy session routes
router.post('/sessions', auth_1.authenticate, mentalHealthController_1.createTherapySession);
router.get('/sessions', auth_1.authenticate, mentalHealthController_1.getPatientTherapySessions);
router.put('/sessions/:id', auth_1.authenticate, mentalHealthController_1.updateTherapySession);
// Therapist matching routes
router.post('/matches', auth_1.authenticate, mentalHealthController_1.matchTherapist);
router.get('/matches', auth_1.authenticate, mentalHealthController_1.getTherapistMatches);
router.put('/matches/:id', auth_1.authenticate, mentalHealthController_1.updateMatchStatus);
exports.default = router;
//# sourceMappingURL=mentalHealth.js.map