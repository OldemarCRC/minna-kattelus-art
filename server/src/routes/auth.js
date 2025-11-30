import express from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  changePassword,
  getAllUsers,
  deleteUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.post('/register', protect, authorize('admin'), registerUser);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;