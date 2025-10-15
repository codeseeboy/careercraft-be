"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databases = void 0;
exports.saveSkinAnalysis = saveSkinAnalysis;
exports.getUserSkinAnalysisHistory = getUserSkinAnalysisHistory;
exports.getSkinAnalysisById = getSkinAnalysisById;
const node_appwrite_1 = require("node-appwrite");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Appwrite Client
const client = new node_appwrite_1.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
// Initialize Databases SDK
exports.databases = new node_appwrite_1.Databases(client);
// Database and collection IDs from environment variables
const databaseId = process.env.APPWRITE_DATABASE_ID || "default";
const skinAnalysisCollectionId = process.env.APPWRITE_SKIN_COLLECTION_ID || "skin_analysis";
/**
 * Save skin analysis results to Appwrite database
 * @param analysisData The skin analysis data to save
 * @param userId Optional user ID to associate with the analysis
 */
async function saveSkinAnalysis(analysisData, userId) {
    try {
        // Prepare document data
        const documentData = {
            ...analysisData,
            userId: userId || "anonymous",
            createdAt: new Date().toISOString()
        };
        // Create document in Appwrite collection
        const response = await exports.databases.createDocument(databaseId, skinAnalysisCollectionId, node_appwrite_1.ID.unique(), documentData);
        console.log(`Skin analysis saved with ID: ${response.$id}`);
        return response;
    }
    catch (error) {
        console.error("Error saving skin analysis to Appwrite:", error);
        throw error;
    }
}
/**
 * Get skin analysis history for a specific user
 * @param userId The user ID to fetch history for
 * @param limit Maximum number of records to return
 */
async function getUserSkinAnalysisHistory(userId, limit = 10) {
    try {
        const response = await exports.databases.listDocuments(databaseId, skinAnalysisCollectionId, [
            node_appwrite_1.Query.equal("userId", userId),
            node_appwrite_1.Query.orderDesc("createdAt"),
            node_appwrite_1.Query.limit(limit)
        ]);
        return response.documents;
    }
    catch (error) {
        console.error(`Error fetching skin analysis history for user ${userId}:`, error);
        throw error;
    }
}
/**
 * Get a single skin analysis record by ID
 * @param analysisId The ID of the analysis document
 */
async function getSkinAnalysisById(analysisId) {
    try {
        const response = await exports.databases.getDocument(databaseId, skinAnalysisCollectionId, analysisId);
        return response;
    }
    catch (error) {
        console.error(`Error fetching skin analysis with ID ${analysisId}:`, error);
        throw error;
    }
}
//# sourceMappingURL=skinAnalysisDb.js.map