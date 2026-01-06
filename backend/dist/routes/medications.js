"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicationController_1 = require("../controllers/medicationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, medicationController_1.getMedications);
router.post('/', auth_1.authenticate, medicationController_1.createMedication);
router.put('/:id', auth_1.authenticate, medicationController_1.updateMedication);
router.post('/log', auth_1.authenticate, medicationController_1.logMedication);
router.get('/upcoming', auth_1.authenticate, medicationController_1.getUpcomingReminders);
exports.default = router;
//# sourceMappingURL=medications.js.map