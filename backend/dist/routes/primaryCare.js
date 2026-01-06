"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const primaryCareController_1 = require("../controllers/primaryCareController");
const router = express_1.default.Router();
router.post('/records', auth_1.authenticate, primaryCareController_1.createPrimaryCareRecord);
router.get('/records', auth_1.authenticate, primaryCareController_1.getPrimaryCareRecords);
router.get('/records/:id', auth_1.authenticate, primaryCareController_1.getPrimaryCareRecordById);
router.put('/records/:id', auth_1.authenticate, primaryCareController_1.updatePrimaryCareRecord);
router.get('/summary', auth_1.authenticate, primaryCareController_1.getPrimaryCareSummary);
exports.default = router;
//# sourceMappingURL=primaryCare.js.map