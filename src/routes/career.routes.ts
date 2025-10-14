import { Router } from 'express';
import upload from '../middleware/uploadMiddleware';
import * as careerController from '../controllers/careerController';

const router = Router();

// Feature 1: Analyze a resume from a PDF upload
router.post('/analyze-resume', upload.single('resume'), careerController.handleResumeAnalysis);

// New Feature: Analyze resume text directly (from editor/live preview)
// Accepts JSON { resumeText: string }
router.post('/analyze-text', careerController.handleAnalyzeText);

// Feature 2: Generate a learning roadmap
router.post('/generate-roadmap', careerController.handleRoadmapGeneration);

// Feature 3: Create an assessment test
router.post('/create-assessment', careerController.handleAssessmentCreation);

export default router;