import { Request, Response } from "express";
/**
 * Analyzes symptoms using Gemini AI and provides health insights
 */
export declare function analyzeUserSymptoms(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
