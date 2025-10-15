import { Request, Response } from "express";
import { getUserSkinAnalysisHistory, getSkinAnalysisById } from "../services/skinAnalysisDb";

/**
 * Retrieves skin analysis history for a user
 */
export async function getSkinAnalysisHistory(req: Request, res: Response) {
  try {
    const userId = req.params.userId || req.query.userId as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "MISSING_USER_ID",
        message: "User ID is required"
      });
    }
    
    const history = await getUserSkinAnalysisHistory(userId, limit);
    
    return res.json({
      success: true,
      count: history.length,
      history
    });
    
  } catch (error: any) {
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
export async function getSkinAnalysisDetail(req: Request, res: Response) {
  try {
    const analysisId = req.params.id;
    
    if (!analysisId) {
      return res.status(400).json({
        success: false,
        error: "MISSING_ANALYSIS_ID",
        message: "Analysis ID is required"
      });
    }
    
    const analysis = await getSkinAnalysisById(analysisId);
    
    return res.json({
      success: true,
      analysis
    });
    
  } catch (error: any) {
    console.error("Error retrieving skin analysis detail:", error);
    
    return res.status(500).json({
      success: false,
      error: "DATABASE_ERROR",
      message: error.message || "Failed to retrieve skin analysis detail"
    });
  }
}