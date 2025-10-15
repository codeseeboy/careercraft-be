import { Client, Storage, Databases, ID, Query } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

// Initialize services
export const storage = new Storage(client);
export const databases = new Databases(client);
export { ID, Query }; // Export utility classes

// Database configuration
export const DB_CONFIG = {
  // Configuration for the new Tables feature (still using Databases API)
  databaseId: process.env.APPWRITE_DATABASE_ID || "68e57e1f00111a44b744", // The ID you provided
  tableId: {
    dat: process.env.APPWRITE_DAT_TABLE_ID || "dat" // Table ID for the 'dat' table
  }
};