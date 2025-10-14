"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusController_1 = require("../controllers/statusController");
const router = (0, express_1.Router)();
router.post("/", statusController_1.statusController);
exports.default = router;
//# sourceMappingURL=status.routes.js.map