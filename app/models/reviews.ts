import pool from "../config/db";
import { tables } from "../utils/helpers";

// Types
export interface FetchReviewsParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
  customer_id?: string;
  product_id?: string;
  rating?: number;
}
export interface FetchReviewsResponse {
  reviews: any[];
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
  fetchAllReviews: async ({
      limit = 4, page = 1,
      sort = 'rv.rating', order = 'DESC',
      search = '',
      customer_id, product_id, rating
    }: FetchReviewsParams): Promise<FetchReviewsResponse> => {
    try {
      const offset = (page - 1) * parseInt(limit+'');
      const values: any[] = [];

      const baseQuery = `
        FROM ${tables.reviews} rv
        JOIN ${tables.product_description} prod_desc ON rv.product_id = prod_desc.product_id
        WHERE rv.status = 1 
      `;

      let whereClause = '';
      if (search) {
        whereClause = ` AND rv.text LIKE ?`;
        values.push(`%${search}%`);
      }

      if (customer_id) {
        whereClause += ` AND rv.customer_id = ?`;
        values.push(customer_id);
      }

      if (product_id) {
        whereClause += ` AND rv.product_id = ?`;
        values.push(product_id);
      }
      
      if (rating) {
        whereClause += ` AND rv.rating = ?`;
        values.push(rating);
      }

      const query = `
        SELECT 
          rv.*,
          prod_desc.name
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
        reviews: results,
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
      console.error('[Model] Error fetching reviews:', error);
      throw error;
    }
  },
  fetchReviewById: async (reviewId: number): Promise<any> => {
    try {
      const query = `
        SELECT
          rv.*,
          prod_desc.name AS product_name
        FROM ${tables.reviews} rv
        JOIN ${tables.product_description} prod_desc ON rv.product_id = prod_desc.product_id
        WHERE rv.review_id = ?
      `;

      const [results]: any = await pool.query(query, [reviewId]);
      return results[0];
    } catch (error) {
      console.error('[Model] Error fetching review by ID:', error);
      throw error;
    }
  }
};
