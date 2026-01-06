"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerFeeController_1 = require("../controllers/providerFeeController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, providerFeeController_1.getProviderFee);
router.get('/all', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), providerFeeController_1.getAllProviderFees);
router.put('/:providerId?', auth_1.authenticate, providerFeeController_1.updateProviderFee);
exports.default = router;
//# sourceMappingURL=providerFees.js.map