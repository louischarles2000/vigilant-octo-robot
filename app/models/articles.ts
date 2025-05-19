import pool from "../config/db";
import { tables } from "../utils/helpers";

// Types
export interface FetchArticlesParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
  language_id?: string;
}
export interface FetchArticleResponse {
  articles: any[];
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
  fetchAllArticles: async ({
      limit = 4, page = 1,
      sort = 'art.date_added', order = 'DESC',
      search = '',
      language_id
    }: FetchArticlesParams): Promise<FetchArticleResponse> => {
    try {
      const offset = (page - 1) * parseInt(limit+'');
      const values: any[] = [];

      const baseQuery = `
        FROM ${tables.articles} art
        JOIN ${tables.article_description} art_desc ON art.article_id = art_desc.article_id
        WHERE art.status = 1 
      `;

      let whereClause = '';
      if (search) {
        whereClause = ` AND art_desc.name LIKE ?`;
        values.push(`%${search}%`);
      }

      if (language_id) {
        whereClause += ` AND art.language_id = ?`;
        values.push(language_id);
      }
      
      const query = `
        SELECT 
          art.*,
          art_desc.*
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
      console.log('total pages', totalPages);

      return {
        articles: results,
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
      console.error('[Model] Error fetching articles:', error);
      throw error;
    }
  },
  fetchArticleById: async (articleId: number): Promise<any> => {
    try {
      const query = `
        SELECT
          art.*,
          art_desc.*
        FROM ${tables.articles} art
        JOIN ${tables.article_description} art_desc ON art.article_id = art_desc.article_id
        WHERE art.article_id = ?
      `;

      const [results]: any = await pool.query(query, [articleId]);
      return results[0];
    } catch (error) {
      console.error('[Model] Error fetching article by ID:', error);
      throw error;
    }
  }
};
