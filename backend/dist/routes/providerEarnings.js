"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerEarningsController_1 = require("../controllers/providerEarningsController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, providerEarningsController_1.getProviderEarnings);
router.post('/payout', auth_1.authenticate, providerEarningsController_1.requestPayout);
router.get('/all', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), providerEarningsController_1.getAllProviderEarnings);
exports.default = router;
//# sourceMappingURL=providerEarnings.js.map