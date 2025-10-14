import { Request, Response } from "express";
import { callMagicalReview } from "../services/magicalApi";

export async function reviewController(req: Request, res: Response) {
  try {
    // Check if URL is directly provided
    if (req.body.url) {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "Resume URL is required" });
      }
      
      try {
        const data = await callMagicalReview(url);
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message || "Error fetching resume review" });
      }
    }
    
    return res.status(400).json({ error: "Resume URL is required" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Error in review controller" });
  }
}