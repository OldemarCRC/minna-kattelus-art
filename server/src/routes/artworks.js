import express from 'express';
import {
  getArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  reorderArtworks,
  getFeaturedArtworks
} from '../controllers/artworkController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadArtworkLimiter, publicArtworkLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rutas públicas
router.get('/featured', getFeaturedArtworks);
router.get('/', publicArtworkLimiter, getArtworks);
router.get('/:id', publicArtworkLimiter, getArtwork);

// Rutas protegidas
router.post('/', protect, authorize('admin', 'editor'), uploadArtworkLimiter, upload.single('image'), createArtwork);
router.put('/:id', protect, authorize('admin', 'editor'), uploadArtworkLimiter, upload.single('image'), updateArtwork);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteArtwork
);

router.patch(
  '/reorder',
  protect,
  authorize('admin', 'editor'),
  reorderArtworks
);

export default router;