import express from 'express';
import { 
  createOrder, 
  getOrder, 
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/', orderLimiter, createOrder);
router.get('/number/:orderNumber', getOrderByNumber);

// Protected routes
router.get('/:orderId', getOrder);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:orderId/status', protect, adminOnly, updateOrderStatus);

export default router;