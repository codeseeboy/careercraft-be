import { Request, Response } from "express";
/**
 * Analyzes skin conditions from an uploaded image using Gemini AI
 */
export declare function analyzeSkin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
