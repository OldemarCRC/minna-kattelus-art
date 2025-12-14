import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route with rate limiting
router.post('/', contactLimiter, sendContactMessage);

export default router;