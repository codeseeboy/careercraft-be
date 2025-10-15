"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_appwrite_1 = require("node-appwrite");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Initialize Appwrite client
const client = new node_appwrite_1.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID || "")
    .setKey(process.env.APPWRITE_API_KEY || "");
const databases = new node_appwrite_1.Databases(client);
/**
 * Setup the Appwrite database structure for the skin analysis feature
 */
async function setupDatTable() {
    try {
        console.log("🔧 Setting up the dat table structure...");
        const databaseId = process.env.APPWRITE_DATABASE_ID;
        const collectionId = "dat";
        if (!databaseId) {
            throw new Error("APPWRITE_DATABASE_ID not defined in .env file");
        }
        console.log(`Using Database ID: ${databaseId}`);
        console.log(`Setting up Collection ID: ${collectionId}`);
        // Get existing attributes to check if we need to create them
        let existingAttributes = [];
        try {
            const collectionInfo = await databases.getCollection(databaseId, collectionId);
            console.log("Collection already exists:", collectionInfo.name);
            // List existing attributes
            const attrsResponse = await databases.listAttributes(databaseId, collectionId);
            existingAttributes = attrsResponse.attributes.map((attr) => attr.key);
            console.log("Existing attributes:", existingAttributes);
        }
        catch (error) {
            if (error.code === 404) {
                console.log("Collection doesn't exist. Creating new collection...");
                await databases.createCollection(databaseId, collectionId, "Skin Analysis Data");
            }
            else {
                throw error;
            }
        }
        // Define attributes to create
        const attributes = [
            { name: "type", type: "string", size: 255, required: true, default: "skin_analysis" },
            { name: "userId", type: "string", size: 255, required: true, default: "anonymous" },
            { name: "timestamp", type: "string", size: 255, required: true },
            { name: "resultsText", type: "string", size: 65535, required: false },
            { name: "recommendationsText", type: "string", size: 65535, required: false },
            { name: "metadataText", type: "string", size: 65535, required: false }
        ];
        // Create attributes if they don't exist
        for (const attr of attributes) {
            if (!existingAttributes.includes(attr.name)) {
                console.log(`Creating ${attr.name} attribute...`);
                try {
                    await databases.createStringAttribute(databaseId, collectionId, attr.name, attr.size || 255, attr.required, attr.default || undefined, attr.default ? true : false);
                    console.log(`✓ Created ${attr.name} attribute`);
                }
                catch (attrError) {
                    console.error(`Error creating attribute ${attr.name}:`, attrError.message);
                }
                console.log(`✓ Created ${attr.name} attribute`);
            }
            else {
                console.log(`Attribute ${attr.name} already exists`);
            }
        }
        console.log("✅ Database structure setup complete!");
    }
    catch (error) {
        console.error("❌ Setup failed:", error);
        if (error && typeof error === 'object' && 'response' in error) {
            console.error("API Response:", error.response);
        }
        process.exit(1);
    }
}
// Run the setup
setupDatTable().then(() => {
    console.log("Setup complete!");
    process.exit(0);
});
//# sourceMappingURL=setupDatTable.js.map