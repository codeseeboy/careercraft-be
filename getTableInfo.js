// getTableInfo.js - Script to get information about the table structure
require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID || "")
    .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

async function getTableInfo() {
    try {
        const databaseId = process.env.APPWRITE_DATABASE_ID;
        const collectionId = "dat";
        
        if (!databaseId) {
            throw new Error("APPWRITE_DATABASE_ID not defined in .env file");
        }
        
        console.log(`Getting collection info for database ID: ${databaseId}, collection ID: ${collectionId}`);
        
        // Get collection information
        const collection = await databases.getCollection(databaseId, collectionId);
        console.log("Collection Information:", JSON.stringify(collection, null, 2));
        
        // Get attribute information
        const attributes = await databases.listAttributes(databaseId, collectionId);
        console.log("Attributes:", JSON.stringify(attributes, null, 2));
        
        return { collection, attributes };
    } catch (error) {
        console.error("Error getting table information:", error);
        if (error.response) {
            console.error("API Response:", error.response);
        }
    }
}

getTableInfo().then(() => {
    console.log("Done getting table information");
});