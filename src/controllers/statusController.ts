import { Request, Response } from "express";
import { callMagicalStatus } from "../services/magicalApi";

export async function statusController(req: Request, res: Response) {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ error: "request_id is required" });
  }

  try {
    const data = await callMagicalStatus(request_id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error fetching status" });
  }
}