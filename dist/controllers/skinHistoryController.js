"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkinAnalysisHistory = getSkinAnalysisHistory;
exports.getSkinAnalysisDetail = getSkinAnalysisDetail;
const skinAnalysisDb_1 = require("../services/skinAnalysisDb");
/**
 * Retrieves skin analysis history for a user
 */
async function getSkinAnalysisHistory(req, res) {
    try {
        const userId = req.params.userId || req.query.userId;
        const limit = parseInt(req.query.limit) || 10;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "MISSING_USER_ID",
                message: "User ID is required"
            });
        }
        const history = await (0, skinAnalysisDb_1.getUserSkinAnalysisHistory)(userId, limit);
        return res.json({
            success: true,
            count: history.length,
            history
        });
    }
    catch (error) {
        console.error("Error retrieving skin analysis history:", error);
        return res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: error.message || "Failed to retrieve skin analysis history"
        });
    }
}
/**
 * Retrieves a single skin analysis record by ID
 */
async function getSkinAnalysisDetail(req, res) {
    try {
        const analysisId = req.params.id;
        if (!analysisId) {
            return res.status(400).json({
                success: false,
                error: "MISSING_ANALYSIS_ID",
                message: "Analysis ID is required"
            });
        }
        const analysis = await (0, skinAnalysisDb_1.getSkinAnalysisById)(analysisId);
        return res.json({
            success: true,
            analysis
        });
    }
    catch (error) {
        console.error("Error retrieving skin analysis detail:", error);
        return res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: error.message || "Failed to retrieve skin analysis detail"
        });
    }
}
//# sourceMappingURL=skinHistoryController.js.map