import { Request, Response } from "express";
/**
 * Retrieves skin analysis history for a user
 */
export declare function getSkinAnalysisHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Retrieves a single skin analysis record by ID
 */
export declare function getSkinAnalysisDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
