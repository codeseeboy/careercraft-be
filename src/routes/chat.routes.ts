import { Router } from 'express';
import * as chatController from '../controllers/chatController';

const router = Router();

// Feature 4: General purpose chatbot
router.post('/ask', chatController.handleChat);

export default router;