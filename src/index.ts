import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import reviewRoutes from "./routes/review.routes";
import scoreRoutes from "./routes/score.routes";
import statusRoutes from "./routes/status.routes";
import uploadRoutes from "./routes/upload.routes";
import jobRoutes from "./routes/job.routes";
import careerRoutes from "./routes/career.routes";
import chatRoutes from "./routes/chat.routes";
import skinRoutes from "./routes/skin.routes";

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5000'], // Allow only the frontend on port 5000
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use("/api/review", reviewRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/skin", skinRoutes);


// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});