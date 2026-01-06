"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clinicalTemplateController_1 = require("../controllers/clinicalTemplateController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), clinicalTemplateController_1.getTemplates);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), clinicalTemplateController_1.createTemplate);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), clinicalTemplateController_1.updateTemplate);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HEALTHCARE_PROVIDER), clinicalTemplateController_1.deleteTemplate);
exports.default = router;
//# sourceMappingURL=clinicalTemplates.js.map