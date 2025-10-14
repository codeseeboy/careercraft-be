import { Request, Response } from "express";
export declare const getJobListings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getJobDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchJobsByFilters: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
