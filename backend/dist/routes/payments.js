"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, paymentController_1.createPayment);
router.post('/verify-2fa', auth_1.authenticate, paymentController_1.verify2FAAndCompletePayment);
router.post('/callback', paymentController_1.processPaymentCallback); // Public endpoint for payment gateway callbacks
router.get('/', auth_1.authenticate, paymentController_1.getPayments);
router.get('/:id', auth_1.authenticate, paymentController_1.getPayment);
exports.default = router;
//# sourceMappingURL=payments.js.map