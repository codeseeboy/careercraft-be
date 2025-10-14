"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnalyzeText = exports.handleAssessmentCreation = exports.handleRoadmapGeneration = exports.handleResumeAnalysis = void 0;
const pdf = require('pdf-parse');
const geminiService = __importStar(require("../services/geminiService"));
const handleResumeAnalysis = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No resume file uploaded.' });
            return;
        }
        const data = await pdf(req.file.buffer);
        const resumeText = data.text;
        const result = await geminiService.analyzeResume(resumeText);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.handleResumeAnalysis = handleResumeAnalysis;
const handleRoadmapGeneration = async (req, res) => {
    try {
        const { score, reason, jobDescription, resumeText } = req.body;
        if (!score || !reason || !jobDescription || !resumeText) {
            res.status(400).json({ error: 'score, reason, jobDescription, and resumeText are required.' });
            return;
        }
        const result = await geminiService.generateLearningRoadmap({ score, reason, jobDescription, resumeText });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.handleRoadmapGeneration = handleRoadmapGeneration;
const handleAssessmentCreation = async (req, res) => {
    try {
        const { topic, level, questionCount } = req.body;
        if (!topic) {
            res.status(400).json({ error: 'topic is required.' });
            return;
        }
        const result = await geminiService.createAssessment({ topic, level, questionCount });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.handleAssessmentCreation = handleAssessmentCreation;
// New: Analyze resume provided as plain text (from editor/live preview)
const handleAnalyzeText = async (req, res) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
            res.status(400).json({ error: 'resumeText is required in request body and must be a non-empty string.' });
            return;
        }
        const result = await geminiService.analyzeResume(resumeText);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.handleAnalyzeText = handleAnalyzeText;
//# sourceMappingURL=careerController.js.map