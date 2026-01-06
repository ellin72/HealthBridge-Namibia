"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wellnessController_1 = require("../controllers/wellnessController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
router.post('/', wellnessController_1.createWellnessContent);
router.get('/', wellnessController_1.getWellnessContent);
router.get('/:id', wellnessController_1.getWellnessContentById);
router.put('/:id', wellnessController_1.updateWellnessContent);
router.delete('/:id', wellnessController_1.deleteWellnessContent);
exports.default = router;
//# sourceMappingURL=wellness.js.map