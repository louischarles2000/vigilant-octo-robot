import pool from "../config/db";
import { tables } from "../utils/helpers";

// Types
export interface FetchCategoriesParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
}
export interface FetchCategoriesResponse {
  categories: any[];
  total: number;
  page: number; 
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
export default {
  fetchAllCategories: async ({ limit = 4, page = 1, sort = 'cat.category_id', order = 'DESC', search = '' }: FetchCategoriesParams): Promise<FetchCategoriesResponse> => {
    try {
      const offset = (page - 1) * parseInt(limit+'');
      const values: any[] = [];

      const baseQuery = `
        FROM ${tables.category} cat
        JOIN ${tables.category_description} cat_desc ON cat.category_id = cat_desc.category_id
        WHERE cat.status = 1 
      `;

      let whereClause = '';
      if (search) {
        whereClause = ` AND cat_desc.name LIKE ?`;
        values.push(`%${search}%`);
      }

      const query = `
        SELECT 
          cat.*,
          cat_desc.name AS category_name,
          cat_desc.description AS description,
          cat.category_id AS id,
          cat_desc.*,
          (SELECT COUNT(*) FROM ${tables.product_to_category} prod_to_cat WHERE prod_to_cat.category_id = cat.category_id) AS total_products
        ${baseQuery}
        ${whereClause}
        ORDER BY ${sort} ${order}
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const [results]: any = await pool.query(query, values);
      const [countResults]: any = await pool.query(`SELECT COUNT(*) AS total ${baseQuery}`, values);
      const total = countResults[0].total;
      const totalPages = Math.ceil(total / parseInt(limit+''));
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const previousPage = hasPreviousPage ? page - 1 : null;

      return {
        categories: results,
        total: total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
      };
    } catch (error) {
      console.error('[Model] Error fetching categories:', error);
      throw error;
    }
  },
  fetchCategoryById: async (categoryId: number): Promise<any> => {
    try {
      const query = `
        SELECT 
          cat.*,
          cat_desc.name AS category_name,
          cat_desc.description AS description,
          cat.category_id AS id,
          cat_desc.*
        FROM ${tables.category} cat
        JOIN ${tables.category_description} cat_desc ON cat.category_id = cat_desc.category_id
        WHERE cat.category_id = ?
      `;
      const [results]: any = await pool.query(query, [categoryId]);
      return results[0];
    } catch (error) {
      console.error('[Model] Error fetching category by ID:', error);
      throw error;
    }
  }
};
