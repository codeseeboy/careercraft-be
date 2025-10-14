import { Router } from "express";
import { statusController } from "../controllers/statusController";

const router = Router();
router.post("/", statusController);

export default router;