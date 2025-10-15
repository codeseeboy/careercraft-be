"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSkin = analyzeSkin;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const geminiService_1 = require("../services/geminiService");
const datService_1 = require("../services/datService");
/**
 * Analyzes skin conditions from an uploaded image using Gemini AI
 */
async function analyzeSkin(req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
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
        console.log("🔍 Calling Gemini API for skin analysis");
        // Call the skin service to analyze the image
        const analysis = await (0, geminiService_1.analyzeSkinCondition)({
            imageBase64,
            format,
            userId: req.body.userId || "anonymous",
            timestamp: req.body.timestamp || new Date().toISOString()
        });
        console.log("✅ Received Gemini API response:", {
            conditions: ((_a = analysis.conditions) === null || _a === void 0 ? void 0 : _a.length) || 0,
            hasRecommendations: !!analysis.recommendations,
            recommendationsCount: ((_b = analysis.recommendations) === null || _b === void 0 ? void 0 : _b.length) || 0
        });
        // Enhanced validation and debugging for recommendations
        console.log("🧪 Recommendations debug info:", {
            rawValue: analysis.recommendations,
            type: typeof analysis.recommendations,
            isArray: Array.isArray(analysis.recommendations),
            length: (_c = analysis.recommendations) === null || _c === void 0 ? void 0 : _c.length
        });
        if (!analysis.recommendations || !Array.isArray(analysis.recommendations) || analysis.recommendations.length === 0) {
            console.log("⚠️ No recommendations found in Gemini response, adding default recommendations");
            analysis.recommendations = [
                "Consult with a dermatologist for a professional diagnosis",
                "Keep the affected area clean and moisturized",
                "Avoid harsh skincare products that may irritate the skin"
            ];
        }
        // Force recommendations to be a valid array - defensive programming
        if (!Array.isArray(analysis.recommendations)) {
            console.log("🛠️ Converting recommendations to array");
            // If recommendations is a string, convert it to a single-element array
            if (typeof analysis.recommendations === 'string' && analysis.recommendations.trim() !== '') {
                analysis.recommendations = [analysis.recommendations];
            }
            else {
                analysis.recommendations = [
                    "Consult with a dermatologist for a professional diagnosis"
                ];
            }
        }
        // Build the response
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;
        console.log("🔧 Building API response with recommendations:", analysis.recommendations);
        const skinAnalysisResponse = {
            success: true,
            results: analysis.conditions.map((c) => {
                console.log(`📊 Processing condition: ${c.name} (${c.severity})`);
                return {
                    condition: c.name,
                    confidence: c.confidence,
                    severity: c.severity
                };
            }),
            recommendations: analysis.recommendations,
            metadata: {
                processingTimeMs,
                modelVersion: "gemini-skin-analyzer-v1",
                timestamp: new Date().toISOString()
            }
        };
        console.log("📦 Final API response structure:", {
            success: skinAnalysisResponse.success,
            resultsCount: (_d = skinAnalysisResponse.results) === null || _d === void 0 ? void 0 : _d.length,
            recommendationsCount: (_e = skinAnalysisResponse.recommendations) === null || _e === void 0 ? void 0 : _e.length,
            processingTimeMs
        });
        // Save the analysis results to the Appwrite database
        try {
            console.log("💾 Saving skin analysis results to Appwrite database");
            // Extract and validate the user ID from request
            let userId = req.body.userId || "anonymous";
            let userEmail = "user@example.com"; // Default email
            // If userId is an email, use it directly
            if (userId.includes('@') && userId.includes('.')) {
                // Validate email format
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (emailRegex.test(userId)) {
                    userEmail = userId;
                }
                else {
                    // If it looks like an email but is invalid, fix it
                    const parts = userId.split('@');
                    userEmail = `${parts[0].replace(/[^a-zA-Z0-9]/g, '')}@example.com`;
                }
            }
            else {
                // Otherwise, create a valid email format from the userId
                // Make sure userId is not empty and contains only valid characters
                const validUserId = userId.replace(/[^a-zA-Z0-9]/g, '') || 'anonymous';
                userEmail = `${validUserId}@skinanalysis.com`;
            }
            console.log(`📧 Using email: ${userEmail} for user: ${userId}`);
            // Create the data object to save
            const dbData = {
                name: `Skin Analysis for ${userId}`, // Use name field that exists in table
                email: userEmail, // Must be a valid email format
                city: "Skin Analysis", // Required field in table
                location: [0, 0], // Location must be a point (latitude, longitude) array
                active: true, // Required field in table
                description: `Skin analysis with ${((_f = skinAnalysisResponse.results) === null || _f === void 0 ? void 0 : _f.length) || 0} conditions and ${((_g = skinAnalysisResponse.recommendations) === null || _g === void 0 ? void 0 : _g.length) || 0} recommendations`, // More informative description
                timestamp: new Date().toISOString(),
                resultsText: JSON.stringify(skinAnalysisResponse.results || []),
                recommendationsText: JSON.stringify(skinAnalysisResponse.recommendations || []),
                metadataText: JSON.stringify({
                    userId: userId,
                    processingTimeMs,
                    modelVersion: "gemini-skin-analyzer-v1",
                    timestamp: new Date().toISOString()
                })
            };
            console.log("📄 Database data prepared:", {
                name: dbData.name,
                email: dbData.email,
                fields: Object.keys(dbData)
            });
            // Save to Appwrite database
            const savedData = await datService_1.datService.create(dbData);
            console.log("✅ Analysis saved to database with ID:", savedData.$id);
            // Add the database record ID to the response
            if (skinAnalysisResponse.metadata) {
                skinAnalysisResponse.metadata.databaseId = savedData.$id;
            }
        }
        catch (dbError) {
            // Don't fail the request if database save fails, just log the error
            console.error("❌ Error saving to database:", dbError);
            console.error("Error code:", dbError.code);
            console.error("Error type:", dbError.type);
            // Add more debugging information
            if (dbError.response) {
                try {
                    const responseData = typeof dbError.response === 'string'
                        ? JSON.parse(dbError.response)
                        : dbError.response;
                    console.error("Response details:", responseData);
                }
                catch (e) {
                    console.error("Raw error response:", dbError.response);
                }
            }
        }
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