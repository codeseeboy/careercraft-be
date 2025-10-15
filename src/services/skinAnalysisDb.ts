import { Client, Databases, ID, Query } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

// Initialize Databases SDK
export const databases = new Databases(client);

// Database and collection IDs from environment variables
const databaseId = process.env.APPWRITE_DATABASE_ID || "default";
const skinAnalysisCollectionId = process.env.APPWRITE_SKIN_COLLECTION_ID || "skin_analysis";

/**
 * Save skin analysis results to Appwrite database
 * @param analysisData The skin analysis data to save
 * @param userId Optional user ID to associate with the analysis
 */
export async function saveSkinAnalysis(analysisData: any, userId?: string) {
  try {
    // Prepare document data
    const documentData = {
      ...analysisData,
      userId: userId || "anonymous",
      createdAt: new Date().toISOString()
    };

    // Create document in Appwrite collection
    const response = await databases.createDocument(
      databaseId,
      skinAnalysisCollectionId,
      ID.unique(),
      documentData
    );

    console.log(`Skin analysis saved with ID: ${response.$id}`);
    return response;
  } catch (error) {
    console.error("Error saving skin analysis to Appwrite:", error);
    throw error;
  }
}

/**
 * Get skin analysis history for a specific user
 * @param userId The user ID to fetch history for
 * @param limit Maximum number of records to return
 */
export async function getUserSkinAnalysisHistory(userId: string, limit: number = 10) {
  try {
    const response = await databases.listDocuments(
      databaseId, 
      skinAnalysisCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
        Query.limit(limit)
      ]
    );
    
    return response.documents;
  } catch (error) {
    console.error(`Error fetching skin analysis history for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get a single skin analysis record by ID
 * @param analysisId The ID of the analysis document
 */
export async function getSkinAnalysisById(analysisId: string) {
  try {
    const response = await databases.getDocument(
      databaseId,
      skinAnalysisCollectionId,
      analysisId
    );
    
    return response;
  } catch (error) {
    console.error(`Error fetching skin analysis with ID ${analysisId}:`, error);
    throw error;
  }
}