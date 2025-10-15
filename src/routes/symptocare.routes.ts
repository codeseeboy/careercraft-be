import { Router } from "express";
import { analyzeUserSymptoms } from "../controllers/symptocareController";

const router = Router();

/**
 * @route   POST /api/symptocare/analyze
 * @desc    Analyze symptoms and provide health insights
 * @access  Public
 */
router.post("/analyze", analyzeUserSymptoms);

export default router;