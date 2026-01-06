"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const triageController_1 = require("../controllers/triageController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/assess', auth_1.authenticate, triageController_1.assessSymptoms);
router.get('/history', auth_1.authenticate, triageController_1.getTriageHistory);
exports.default = router;
//# sourceMappingURL=triage.js.map