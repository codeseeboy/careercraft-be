"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatController = void 0;
const datService_1 = require("../services/datService");
const node_appwrite_1 = require("node-appwrite");
/**
 * Controller for handling dat collection operations
 */
class DatController {
    /**
     * Create a new dat record
     */
    async create(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "No data provided"
                });
            }
            const result = await datService_1.datService.create(data);
            return res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error("Error in createDat:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to create dat record"
            });
        }
    }
    /**
     * Get a single dat record by ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "No ID provided"
                });
            }
            const result = await datService_1.datService.getById(id);
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error("Error in getDatById:", error);
            return res.status(error.code === 404 ? 404 : 500).json({
                success: false,
                message: error.message || "Failed to retrieve dat record"
            });
        }
    }
    /**
     * List all dat records with optional filtering
     */
    async list(req, res) {
        try {
            const queries = [];
            const limit = Number(req.query.limit) || 50;
            // Optional filtering by fields
            if (req.query.field && req.query.value) {
                queries.push(node_appwrite_1.Query.equal(req.query.field, req.query.value));
            }
            const result = await datService_1.datService.list(queries, limit);
            return res.json({
                success: true,
                data: result.documents,
                total: result.total
            });
        }
        catch (error) {
            console.error("Error in listDat:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to list dat records"
            });
        }
    }
    /**
     * Update an existing dat record
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "No ID provided"
                });
            }
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "No update data provided"
                });
            }
            const result = await datService_1.datService.update(id, data);
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error("Error in updateDat:", error);
            return res.status(error.code === 404 ? 404 : 500).json({
                success: false,
                message: error.message || "Failed to update dat record"
            });
        }
    }
    /**
     * Delete a dat record
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "No ID provided"
                });
            }
            await datService_1.datService.delete(id);
            return res.json({
                success: true,
                message: "Record deleted successfully"
            });
        }
        catch (error) {
            console.error("Error in deleteDat:", error);
            return res.status(error.code === 404 ? 404 : 500).json({
                success: false,
                message: error.message || "Failed to delete dat record"
            });
        }
    }
}
exports.DatController = DatController;
//# sourceMappingURL=datController.js.map