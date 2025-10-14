"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = reviewController;
const magicalApi_1 = require("../services/magicalApi");
async function reviewController(req, res) {
    try {
        // Check if URL is directly provided
        if (req.body.url) {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: "Resume URL is required" });
            }
            try {
                const data = await (0, magicalApi_1.callMagicalReview)(url);
                return res.json(data);
            }
            catch (err) {
                return res.status(500).json({ error: err.message || "Error fetching resume review" });
            }
        }
        return res.status(400).json({ error: "Resume URL is required" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Error in review controller" });
    }
}
//# sourceMappingURL=reviewController.js.map