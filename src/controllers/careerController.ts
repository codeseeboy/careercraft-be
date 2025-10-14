import { Request, Response } from 'express';
const pdf = require('pdf-parse');
import * as geminiService from '../services/geminiService';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const handleResumeAnalysis = async (req: MulterRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No resume file uploaded.' });
            return;
        }

        const data = await pdf(req.file.buffer);
        const resumeText = data.text;

        const result = await geminiService.analyzeResume(resumeText);
        res.json(result);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleRoadmapGeneration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score, reason, jobDescription, resumeText } = req.body;
        if (!score || !reason || !jobDescription || !resumeText) {
            res.status(400).json({ error: 'score, reason, jobDescription, and resumeText are required.' });
            return;
        }
        const result = await geminiService.generateLearningRoadmap({ score, reason, jobDescription, resumeText });
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleAssessmentCreation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { topic, level, questionCount } = req.body;
        if (!topic) {
            res.status(400).json({ error: 'topic is required.' });
            return;
        }
        const result = await geminiService.createAssessment({ topic, level, questionCount });
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// New: Analyze resume provided as plain text (from editor/live preview)
export const handleAnalyzeText = async (req: Request, res: Response): Promise<void> => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
            res.status(400).json({ error: 'resumeText is required in request body and must be a non-empty string.' });
            return;
        }

        const result = await geminiService.analyzeResume(resumeText);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};