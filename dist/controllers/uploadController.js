"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResumeController = uploadResumeController;
const appwriteClient_1 = require("../services/appwriteClient");
const node_appwrite_1 = require("node-appwrite");
async function uploadResumeController(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded. Please attach a resume file." });
    }
    try {
        // Create a File object from the buffer - convert Buffer to ArrayBuffer
        const arrayBuffer = new ArrayBuffer(file.buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < file.buffer.length; ++i) {
            view[i] = file.buffer[i];
        }
        const fileObj = new File([arrayBuffer], file.originalname, {
            type: file.mimetype,
        });
        // Upload resume to Appwrite Storage bucket
        const uploadedFile = await appwriteClient_1.storage.createFile(process.env.APPWRITE_BUCKET_ID, node_appwrite_1.ID.unique(), fileObj);
        // Construct the public URL (using download endpoint for better compatibility with Magical API)
        const publicUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/download?project=${process.env.APPWRITE_PROJECT_ID}`;
        return res.status(200).json({
            message: "Resume uploaded successfully",
            fileId: uploadedFile.$id,
            url: publicUrl,
        });
    }
    catch (error) {
        console.error("❌ Error uploading resume:", error);
        return res.status(500).json({
            error: error.message || "Failed to upload resume",
        });
    }
}
//# sourceMappingURL=uploadController.js.map