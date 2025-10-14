import express from "express";
import { getJobListings, getJobDetails, searchJobsByFilters } from "../controllers/jobController";

const router = express.Router();

// GET /api/jobs - Get job listings with basic search
router.get("/", getJobListings);

// GET /api/jobs/search - Advanced search with filters
router.get("/search", searchJobsByFilters);

// GET /api/jobs/:id - Get specific job details by ID
router.get("/:id", getJobDetails);

export default router;