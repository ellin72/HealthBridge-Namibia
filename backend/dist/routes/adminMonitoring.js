"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMonitoringController_1 = require("../controllers/adminMonitoringController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/transactions', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), adminMonitoringController_1.getTransactionMonitoring);
router.get('/fraud-alerts', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), adminMonitoringController_1.getFraudAlerts);
router.post('/reconcile', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), adminMonitoringController_1.reconcileTransactions);
exports.default = router;
//# sourceMappingURL=adminMonitoring.js.map