import { Router } from "express";
import multer from "multer";
import { uploadResumeController } from "../controllers/uploadController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), uploadResumeController);

export default router;