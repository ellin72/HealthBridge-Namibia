"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultationController_1 = require("../controllers/consultationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
router.post('/', consultationController_1.createConsultationNote);
router.get('/', consultationController_1.getConsultationNotes);
router.get('/:id', consultationController_1.getConsultationNoteById);
router.put('/:id', consultationController_1.updateConsultationNote);
exports.default = router;
//# sourceMappingURL=consultations.js.map