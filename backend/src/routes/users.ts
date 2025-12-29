import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (Admin only)
router.get('/', authorize(UserRole.ADMIN), getUsers);

// Create user (Admin only)
router.post('/', authorize(UserRole.ADMIN), createUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user (Admin only)
router.delete('/:id', authorize(UserRole.ADMIN), deleteUser);

export default router;

