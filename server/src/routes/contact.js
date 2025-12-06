import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Public route - No authentication needed
router.post('/', sendContactMessage);

export default router;