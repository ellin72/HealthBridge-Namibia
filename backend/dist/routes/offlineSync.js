"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const offlineSyncController_1 = require("../controllers/offlineSyncController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/sync', auth_1.authenticate, offlineSyncController_1.syncOfflineData);
router.get('/status', auth_1.authenticate, offlineSyncController_1.getSyncStatus);
exports.default = router;
//# sourceMappingURL=offlineSync.js.map