import { Router } from "express";
import multer from "multer";
import path from "path";
import { reviewController } from "../controllers/reviewController";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = Router();

// Support both file uploads and direct URL submission
router.post("/", upload.single("resume"), reviewController);

export default router;