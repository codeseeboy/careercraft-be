import { Request, Response } from 'express';
import * as geminiService from '../services/geminiService';

export const handleChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'Prompt is required.' });
            return;
        }
        const result = await geminiService.generalChat(prompt);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};