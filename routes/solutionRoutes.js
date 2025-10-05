import express from 'express';
const router = express.Router();
import {
  getSolutions,
  addSolution,
  updateSolution,
  deleteSolution
} from '../controllers/solutionController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes require authentication
router.use(protect);

router.get('/', getSolutions);
router.post('/', addSolution);
router.put('/:id', updateSolution);
router.delete('/:id', deleteSolution);

export default router;