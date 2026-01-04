import express from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  changePassword,
  getAllUsers,
  deleteUser,
  logoutUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { 
  loginLimiter, 
  registerLimiter, 
  verifyEmailLimiter, 
  passwordChangeLimiter 
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/login', loginLimiter, loginUser);
router.get('/verify-email/:token', verifyEmailLimiter, verifyEmail);

// Protected routes with rate limiting
router.post('/register', protect, authorize('admin'), registerLimiter, registerUser);
router.put('/change-password', protect, passwordChangeLimiter, changePassword);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.post('/logout', protect, logoutUser);

export default router;