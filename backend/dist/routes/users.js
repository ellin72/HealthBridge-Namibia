"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Get all users (Admin only)
router.get('/', (0, auth_1.authorize)(client_1.UserRole.ADMIN), userController_1.getUsers);
// Create user (Admin only)
router.post('/', (0, auth_1.authorize)(client_1.UserRole.ADMIN), userController_1.createUser);
// Get user by ID
router.get('/:id', userController_1.getUserById);
// Update user
router.put('/:id', userController_1.updateUser);
// Delete user (Admin only)
router.delete('/:id', (0, auth_1.authorize)(client_1.UserRole.ADMIN), userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map