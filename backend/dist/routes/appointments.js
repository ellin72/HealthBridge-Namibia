"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
router.post('/', appointmentController_1.createAppointment);
router.get('/', appointmentController_1.getAppointments);
router.get('/:id', appointmentController_1.getAppointmentById);
router.put('/:id', appointmentController_1.updateAppointment);
router.delete('/:id', appointmentController_1.deleteAppointment);
exports.default = router;
//# sourceMappingURL=appointments.js.map