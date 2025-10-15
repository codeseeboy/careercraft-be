"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_CONFIG = exports.Query = exports.ID = exports.databases = exports.storage = void 0;
const node_appwrite_1 = require("node-appwrite");
Object.defineProperty(exports, "ID", { enumerable: true, get: function () { return node_appwrite_1.ID; } });
Object.defineProperty(exports, "Query", { enumerable: true, get: function () { return node_appwrite_1.Query; } });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new node_appwrite_1.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
// Initialize services
exports.storage = new node_appwrite_1.Storage(client);
exports.databases = new node_appwrite_1.Databases(client);
// Database configuration
exports.DB_CONFIG = {
    // Configuration for the new Tables feature (still using Databases API)
    databaseId: process.env.APPWRITE_DATABASE_ID || "68e57e1f00111a44b744", // The ID you provided
    tableId: {
        dat: process.env.APPWRITE_DAT_TABLE_ID || "dat" // Table ID for the 'dat' table
    }
};
//# sourceMappingURL=appwriteClient.js.map