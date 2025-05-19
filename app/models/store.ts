import pool from "../config/db";
import { tables } from "../utils/helpers";

export default {
  fetchStoreCurrency: async (): Promise<any> => {
    try {
      const query = `
        SELECT
          *
        FROM ${tables.currency}
        WHERE code IN (SELECT value FROM ${tables.setting} WHERE \`key\` = 'config_currency')
      `;
      const [results]: any = await pool.query(query);
      return results[0];
    } catch (error) {
      console.error('[Model] Error fetching storeCurrency by ID:', error);
      throw error;
    }
  }
};
