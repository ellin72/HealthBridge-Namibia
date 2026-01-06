"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const monitoringController_1 = require("../controllers/monitoringController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, monitoringController_1.getMonitoringData);
router.get('/stats', auth_1.authenticate, monitoringController_1.getMonitoringStats);
router.post('/', auth_1.authenticate, monitoringController_1.createMonitoringData);
exports.default = router;
//# sourceMappingURL=monitoring.js.map