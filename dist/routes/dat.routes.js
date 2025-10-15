"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datController_1 = require("../controllers/datController");
const router = (0, express_1.Router)();
const datController = new datController_1.DatController();
/**
 * @route   POST /api/dat
 * @desc    Create a new dat record
 * @access  Public
 */
router.post("/", datController.create);
/**
 * @route   GET /api/dat
 * @desc    List all dat records with optional filtering
 * @access  Public
 */
router.get("/", datController.list);
/**
 * @route   GET /api/dat/:id
 * @desc    Get a single dat record by ID
 * @access  Public
 */
router.get("/:id", datController.getById);
/**
 * @route   PUT /api/dat/:id
 * @desc    Update an existing dat record
 * @access  Public
 */
router.put("/:id", datController.update);
/**
 * @route   DELETE /api/dat/:id
 * @desc    Delete a dat record
 * @access  Public
 */
router.delete("/:id", datController.delete);
exports.default = router;
//# sourceMappingURL=dat.routes.js.map