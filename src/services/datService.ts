import { databases, DB_CONFIG, ID, Query } from "./appwriteClient";

/**
 * Service for interacting with the 'dat' table in Appwrite
 * Updated to work with the TablesDB model (Appwrite v1.6+)
 */
export const datService = {
  /**
   * Create a new row in the dat table
   * @param data The data to store in the row
   * @returns The created document
   */
  async create(data: any) {
    try {
      return await databases.createDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.tableId.dat,
        ID.unique(), // Generate a unique ID
        data
      );
    } catch (error) {
      console.error("Error creating dat record:", error);
      throw error;
    }
  },

  /**
   * Get a row by its ID
   * @param rowId The ID of the row to retrieve
   * @returns The requested row
   */
  async getById(rowId: string) {
    try {
      return await databases.getDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.tableId.dat,
        rowId
      );
    } catch (error) {
      console.error("Error retrieving dat record:", error);
      throw error;
    }
  },

  /**
   * List rows with optional filtering
   * @param filters Optional Query filters
   * @param limit Maximum number of rows to return
   * @returns List of rows
   */
  async list(queries: any[] = [], limit: number = 50) {
    try {
      return await databases.listDocuments(
        DB_CONFIG.databaseId,
        DB_CONFIG.tableId.dat,
        [
          ...(queries.length > 0 ? queries : []),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error("Error listing dat records:", error);
      throw error;
    }
  },

  /**
   * Update an existing row
   * @param rowId The ID of the row to update
   * @param data The new data for the row
   * @returns The updated row
   */
  async update(rowId: string, data: any) {
    try {
      return await databases.updateDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.tableId.dat,
        rowId,
        data
      );
    } catch (error) {
      console.error("Error updating dat record:", error);
      throw error;
    }
  },

  /**
   * Delete a row
   * @param rowId The ID of the row to delete
   * @returns Success status
   */
  async delete(rowId: string) {
    try {
      await databases.deleteDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.tableId.dat,
        rowId
      );
      return true;
    } catch (error) {
      console.error("Error deleting dat record:", error);
      throw error;
    }
  }
};