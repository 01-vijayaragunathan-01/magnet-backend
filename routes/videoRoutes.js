import express from 'express';
const router = express.Router();
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByUser
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.get('/user/:userId', getVideosByUser);

// Protected routes (require authentication)
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

export default router;