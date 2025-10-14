import { Request, Response } from "express";
import { storage } from "../services/appwriteClient";
import { ID } from "node-appwrite";

export async function uploadResumeController(req: Request, res: Response) {
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
    const uploadedFile = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      ID.unique(),
      fileObj
    );

    // Construct the public URL (using download endpoint for better compatibility with Magical API)
    const publicUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/download?project=${process.env.APPWRITE_PROJECT_ID}`;

    return res.status(200).json({
      message: "Resume uploaded successfully",
      fileId: uploadedFile.$id,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error("❌ Error uploading resume:", error);
    return res.status(500).json({
      error: error.message || "Failed to upload resume",
    });
  }
}