"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const urgentCareController_1 = require("../controllers/urgentCareController");
const router = express_1.default.Router();
router.post('/requests', auth_1.authenticate, urgentCareController_1.createUrgentCareRequest);
// IMPORTANT: /requests/all must come before /requests to prevent /requests from matching /requests/all
router.get('/requests/all', auth_1.authenticate, urgentCareController_1.getAllUrgentCareRequests);
router.get('/requests', auth_1.authenticate, urgentCareController_1.getUrgentCareRequests);
router.get('/requests/:id', auth_1.authenticate, urgentCareController_1.getUrgentCareRequestById);
router.put('/requests/:id', auth_1.authenticate, urgentCareController_1.updateUrgentCareRequest);
router.get('/statistics', auth_1.authenticate, urgentCareController_1.getUrgentCareStatistics);
exports.default = router;
//# sourceMappingURL=urgentCare.js.map