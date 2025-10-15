import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as skinController from '../controllers/skinController';
import { getSkinAnalysisHistory, getSkinAnalysisDetail } from '../controllers/skinHistoryController';

const router = express.Router();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/skin');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'skin-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/i;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
  }
};

// Initialize multer with the storage configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter: fileFilter
});

// Route for analyzing skin condition via file upload
router.post('/analyze-image', upload.single('image'), skinController.analyzeSkin);

// Route for analyzing skin condition via base64 encoded image
router.post('/analyze', skinController.analyzeSkin);

// Test route to check if the API is working
router.get('/', (req, res) => {
  res.json({ message: 'Skin Analysis API is running' });
});

// Route to get skin analysis history for a user
router.get('/history/:userId', getSkinAnalysisHistory);
router.get('/history', getSkinAnalysisHistory); // Alternative with query param

// Route to get a specific skin analysis record
router.get('/analysis/:id', getSkinAnalysisDetail);

export default router;