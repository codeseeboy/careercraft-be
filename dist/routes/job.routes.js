"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const router = express_1.default.Router();
// GET /api/jobs - Get job listings with basic search
router.get("/", jobController_1.getJobListings);
// GET /api/jobs/search - Advanced search with filters
router.get("/search", jobController_1.searchJobsByFilters);
// GET /api/jobs/:id - Get specific job details by ID
router.get("/:id", jobController_1.getJobDetails);
exports.default = router;
//# sourceMappingURL=job.routes.js.map