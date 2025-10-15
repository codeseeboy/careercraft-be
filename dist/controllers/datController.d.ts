import { Request, Response } from "express";
/**
 * Controller for handling dat collection operations
 */
export declare class DatController {
    /**
     * Create a new dat record
     */
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get a single dat record by ID
     */
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * List all dat records with optional filtering
     */
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update an existing dat record
     */
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a dat record
     */
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
