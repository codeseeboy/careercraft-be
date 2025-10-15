import { Databases } from "node-appwrite";
export declare const databases: Databases;
/**
 * Save skin analysis results to Appwrite database
 * @param analysisData The skin analysis data to save
 * @param userId Optional user ID to associate with the analysis
 */
export declare function saveSkinAnalysis(analysisData: any, userId?: string): Promise<import("node-appwrite").Models.Document>;
/**
 * Get skin analysis history for a specific user
 * @param userId The user ID to fetch history for
 * @param limit Maximum number of records to return
 */
export declare function getUserSkinAnalysisHistory(userId: string, limit?: number): Promise<import("node-appwrite").Models.Document[]>;
/**
 * Get a single skin analysis record by ID
 * @param analysisId The ID of the analysis document
 */
export declare function getSkinAnalysisById(analysisId: string): Promise<import("node-appwrite").Models.Document>;
