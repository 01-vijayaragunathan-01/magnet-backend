import express from 'express';
const router = express.Router();
import {
  getAllScreenshots,
  getScreenshotById,
  uploadScreenshot,
  updateScreenshot,
  deleteScreenshot,
  getScreenshotsByUser
} from '../controllers/screenshotController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllScreenshots);
router.get('/:id', getScreenshotById);
router.get('/user/:userId', getScreenshotsByUser);

// Protected routes (require authentication)
router.post('/', protect, uploadScreenshot);
router.put('/:id', protect, updateScreenshot);
router.delete('/:id', protect, deleteScreenshot);

export default router;