"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalAidController_1 = require("../controllers/medicalAidController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, medicalAidController_1.getMedicalAidInfo);
router.post('/', auth_1.authenticate, medicalAidController_1.upsertMedicalAidInfo);
router.put('/', auth_1.authenticate, medicalAidController_1.upsertMedicalAidInfo);
router.post('/verify', auth_1.authenticate, medicalAidController_1.verifyMedicalAid);
router.post('/claims', auth_1.authenticate, medicalAidController_1.submitClaim);
router.get('/claims', auth_1.authenticate, medicalAidController_1.getClaims);
exports.default = router;
//# sourceMappingURL=medicalAid.js.map