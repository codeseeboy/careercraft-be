"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusController = statusController;
const magicalApi_1 = require("../services/magicalApi");
async function statusController(req, res) {
    const { request_id } = req.body;
    if (!request_id) {
        return res.status(400).json({ error: "request_id is required" });
    }
    try {
        const data = await (0, magicalApi_1.callMagicalStatus)(request_id);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message || "Error fetching status" });
    }
}
//# sourceMappingURL=statusController.js.map