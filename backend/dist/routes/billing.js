"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billingController_1 = require("../controllers/billingController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, billingController_1.getInvoices);
router.get('/stats', auth_1.authenticate, billingController_1.getBillingStats);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), billingController_1.createInvoice);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), billingController_1.updateInvoice);
exports.default = router;
//# sourceMappingURL=billing.js.map