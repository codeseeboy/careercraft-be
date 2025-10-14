"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSkin = analyzeSkin;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const geminiService_1 = require("../services/geminiService");
/**
 * Analyzes skin conditions from an uploaded image using Gemini AI
 */
async function analyzeSkin(req, res) {
    const startTime = Date.now();
    try {
        // Handle different input formats
        let imageBase64;
        let format = "unknown";
        // Handle file upload from multer middleware
        if (req.file) {
            const fileData = fs_1.default.readFileSync(req.file.path);
            imageBase64 = fileData.toString("base64");
            format = path_1.default.extname(req.file.originalname).substring(1) || "jpg";
            const fileInfo = {
                filename: req.file.originalname,
                size: req.file.size,
                format
            };
            console.log("Analyzing skin image:", fileInfo);
        }
        // Handle base64 encoded image in JSON body
        else if (req.body.image) {
            imageBase64 = req.body.image;
            format = req.body.format || "jpg";
            console.log("Analyzing skin image from base64 data");
        }
        // No image provided
        else {
            return res.status(400).json({
                success: false,
                error: "MISSING_IMAGE",
                message: "Please upload an image for skin analysis"
            });
        }
        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                error: "INVALID_IMAGE",
                message: "Unable to process the provided image"
            });
        }
        // Call the skin service to analyze the image
        const analysis = await (0, geminiService_1.analyzeSkinCondition)({
            imageBase64,
            format,
            userId: req.body.userId || "anonymous",
            timestamp: req.body.timestamp || new Date().toISOString()
        });
        // Build the response
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;
        const skinAnalysisResponse = {
            success: true,
            results: analysis.conditions.map((c) => ({
                condition: c.name,
                confidence: c.confidence,
                severity: c.severity
            })),
            recommendations: analysis.recommendations || [],
            metadata: {
                processingTimeMs,
                modelVersion: "gemini-skin-analyzer-v1",
                timestamp: new Date().toISOString()
            }
        };
        return res.json(skinAnalysisResponse);
    }
    catch (error) {
        console.error("Skin analysis error:", error);
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;
        const skinAnalysisResponse = {
            success: false,
            error: "PROCESSING_ERROR",
            errorCode: error.code || "UNKNOWN_ERROR",
            message: error.message || "Failed to analyze skin image",
            metadata: {
                processingTimeMs,
                modelVersion: "gemini-skin-analyzer-v1",
                timestamp: new Date().toISOString()
            }
        };
        return res.status(500).json(skinAnalysisResponse);
    }
}
//# sourceMappingURL=skinController.js.map