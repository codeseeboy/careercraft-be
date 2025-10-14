"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreController = scoreController;
const magicalApi_1 = require("../services/magicalApi");
async function scoreController(req, res) {
    try {
        console.log("Score controller called with:", {
            body: req.body,
            hasFile: !!req.file,
            method: req.method,
        });
        const { job_description } = req.body;
        if (!job_description) {
            console.warn("Missing job description in request");
            return res.status(400).json({ error: "Job Description is required" });
        }
        // Check if URL is directly provided
        if (req.body.url) {
            const { url } = req.body;
            if (!url) {
                console.warn("URL parameter is empty");
                return res.status(400).json({ error: "Resume URL is required" });
            }
            try {
                console.log(`Processing score request for URL: ${url.substring(0, 50)}...`);
                const data = await (0, magicalApi_1.callMagicalScore)(url, job_description);
                // Ensure the score is always present in the response
                if (!data.data || data.data.score === undefined) {
                    console.warn("API returned data but missing score:", data);
                    // Default the score to 0 if missing
                    if (!data.data)
                        data.data = {};
                    data.data.score = 0;
                    data.data.reason = data.data.reason || "Unable to determine score for this resume and job combination.";
                }
                console.log("Sending score response:", data);
                return res.json(data);
            }
            catch (err) {
                console.error("Error in score processing:", err);
                return res.status(500).json({ error: err.message || "Error fetching resume score" });
            }
        }
        // If we get here, we don't have what we need
        console.warn("Missing URL parameter in request");
        return res.status(400).json({ error: "Resume URL is required" });
    }
    catch (err) {
        console.error("Unexpected error in score controller:", err);
        return res.status(500).json({ error: err.message || "Error in score controller" });
    }
}
//# sourceMappingURL=scoreController.js.map