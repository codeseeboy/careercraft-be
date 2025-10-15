"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const symptocareController_1 = require("../controllers/symptocareController");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/symptocare/analyze
 * @desc    Analyze symptoms and provide health insights
 * @access  Public
 */
router.post("/analyze", symptocareController_1.analyzeUserSymptoms);
exports.default = router;
//# sourceMappingURL=symptocare.routes.js.map