import { Request, Response } from 'express';
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
export declare const handleResumeAnalysis: (req: MulterRequest, res: Response) => Promise<void>;
export declare const handleRoadmapGeneration: (req: Request, res: Response) => Promise<void>;
export declare const handleAssessmentCreation: (req: Request, res: Response) => Promise<void>;
export declare const handleAnalyzeText: (req: Request, res: Response) => Promise<void>;
export {};
