/**
 * Service for interacting with the 'dat' table in Appwrite
 * Updated to work with the TablesDB model (Appwrite v1.6+)
 */
export declare const datService: {
    /**
     * Create a new row in the dat table
     * @param data The data to store in the row
     * @returns The created document
     */
    create(data: any): Promise<import("node-appwrite").Models.Document>;
    /**
     * Get a row by its ID
     * @param rowId The ID of the row to retrieve
     * @returns The requested row
     */
    getById(rowId: string): Promise<import("node-appwrite").Models.Document>;
    /**
     * List rows with optional filtering
     * @param filters Optional Query filters
     * @param limit Maximum number of rows to return
     * @returns List of rows
     */
    list(queries?: any[], limit?: number): Promise<import("node-appwrite").Models.DocumentList<import("node-appwrite").Models.Document>>;
    /**
     * Update an existing row
     * @param rowId The ID of the row to update
     * @param data The new data for the row
     * @returns The updated row
     */
    update(rowId: string, data: any): Promise<import("node-appwrite").Models.Document>;
    /**
     * Delete a row
     * @param rowId The ID of the row to delete
     * @returns Success status
     */
    delete(rowId: string): Promise<boolean>;
};
