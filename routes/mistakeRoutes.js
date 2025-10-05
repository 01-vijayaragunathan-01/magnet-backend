import express from 'express';
const router = express.Router();
import {
  getMistakes,
  addMistake,
  updateMistake,
  deleteMistake
} from '../controllers/mistakeController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes require authentication
router.use(protect);

router.get('/', getMistakes);
router.post('/', addMistake);
router.put('/:id', updateMistake);
router.delete('/:id', deleteMistake);

export default router;