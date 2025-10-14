"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
const status_routes_1 = __importDefault(require("./routes/status.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const career_routes_1 = __importDefault(require("./routes/career.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const skin_routes_1 = __importDefault(require("./routes/skin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for development - restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
app.use(express_1.default.json());
// Serve static files from the 'public' directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use("/api/review", review_routes_1.default);
app.use("/api/score", score_routes_1.default);
app.use("/api/status", status_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/jobs", job_routes_1.default);
app.use("/api/career", career_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/skin", skin_routes_1.default);
// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map