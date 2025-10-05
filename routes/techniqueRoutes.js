import express from "express";
import {
  getTechniques,
  addTechnique,
  updateTechnique,
  deleteTechnique,
} from "../controllers/techniqueController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - anyone can view
router.get("/", getTechniques);

// Protected routes - require authentication
router.post("/", protect, addTechnique);
router.put("/:id", protect, updateTechnique);
router.delete("/:id", protect, deleteTechnique);

export default router;