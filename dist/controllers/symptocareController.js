"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserSymptoms = analyzeUserSymptoms;
const geminiService_1 = require("../services/geminiService");
const datService_1 = require("../services/datService");
/**
 * Analyzes symptoms using Gemini AI and provides health insights
 */
async function analyzeUserSymptoms(req, res) {
    var _a, _b, _c;
    const startTime = Date.now();
    const requestId = `req_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`;
    try {
        // Validate request body
        const { userId, symptoms, additionalInfo } = req.body;
        if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INSUFFICIENT_DATA",
                    message: "Please provide detailed symptom information",
                    requestId
                },
                metadata: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        console.log("🔍 Analyzing symptoms:", {
            userId: userId || "anonymous",
            symptomLength: symptoms.length,
            hasAdditionalInfo: !!additionalInfo
        });
        // Call the Gemini service to analyze symptoms
        const analysis = await (0, geminiService_1.analyzeSymptoms)({
            symptoms,
            additionalInfo,
            userId: userId || "anonymous",
            timestamp: new Date().toISOString()
        });
        console.log("✅ Received Gemini API response:", {
            extractedSymptoms: ((_a = analysis.extractedSymptoms) === null || _a === void 0 ? void 0 : _a.length) || 0,
            possibleConditions: ((_b = analysis.possibleConditions) === null || _b === void 0 ? void 0 : _b.length) || 0,
            hasRecommendations: !!analysis.recommendations,
            recommendationsCount: ((_c = analysis.recommendations) === null || _c === void 0 ? void 0 : _c.length) || 0
        });
        // Ensure recommendations are valid
        if (!analysis.recommendations || !Array.isArray(analysis.recommendations) || analysis.recommendations.length === 0) {
            console.log("⚠️ No recommendations found in Gemini response, adding default recommendations");
            analysis.recommendations = [
                "Consult with a healthcare professional for an accurate diagnosis",
                "Rest and stay hydrated",
                "Monitor your symptoms and seek immediate medical attention if they worsen"
            ];
        }
        // Build the response
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;
        const symptoCareResponse = {
            success: true,
            analysis: {
                extractedSymptoms: analysis.extractedSymptoms || [],
                possibleConditions: analysis.possibleConditions || [],
                specialistRecommendation: analysis.specialistRecommendation,
                urgencyLevel: analysis.urgencyLevel || "low",
                recommendations: analysis.recommendations,
                followUpQuestions: analysis.followUpQuestions || []
            },
            metadata: {
                analysisId: `sc_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                disclaimer: "This analysis is informational only and not a medical diagnosis. Always consult with healthcare professionals.",
                processingTimeMs
            }
        };
        // Save to database
        try {
            console.log("💾 Saving symptom analysis results to Appwrite database");
            // Format email properly with userId
            let userEmail = "anonymous@symptocare.ai";
            if (userId) {
                // Ensure userId is formatted as a valid email
                userEmail = userId.includes('@') ? userId : `${userId}@symptocare.ai`;
            }
            // Create the data object to save
            const dbData = {
                name: `Symptom Analysis ${new Date().toLocaleString()}`,
                email: userEmail,
                city: "SymptoCare",
                location: [0, 0], // Default location coordinates
                active: true,
                description: symptoms.substring(0, 255), // Limit description to 255 chars
                timestamp: new Date().toISOString(),
                resultsText: JSON.stringify(symptoCareResponse.analysis || {}),
                recommendationsText: JSON.stringify(analysis.recommendations || []),
                metadataText: JSON.stringify({
                    processingTimeMs,
                    requestId,
                    userId: userId || "anonymous"
                })
            };
            // Save to Appwrite database
            const savedData = await datService_1.datService.create(dbData);
            console.log("✅ Analysis saved to database with ID:", savedData.$id);
            // Add the database record ID to the response
            if (symptoCareResponse.metadata) {
                symptoCareResponse.metadata.databaseId = savedData.$id;
            }
        }
        catch (dbError) {
            // Don't fail the request if database save fails, just log the error
            console.error("❌ Error saving to database:", dbError);
        }
        return res.json(symptoCareResponse);
    }
    catch (error) {
        console.error("Symptom analysis error:", error);
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;
        const errorResponse = {
            success: false,
            error: {
                code: "PROCESSING_ERROR",
                message: error.message || "Failed to analyze symptoms",
                requestId
            },
            metadata: {
                timestamp: new Date().toISOString(),
                disclaimer: "This analysis is informational only and not a medical diagnosis. Always consult with healthcare professionals.",
                processingTimeMs
            }
        };
        return res.status(500).json(errorResponse);
    }
}
//# sourceMappingURL=symptocareController.js.map