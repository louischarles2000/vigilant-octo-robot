import pool from "../config/db";
import { tables } from "../utils/helpers";

// Types
export interface FetchProductsParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
  category?: string;
  tags?: string;
  model?: string;
  priceRange?: string; // format: min-max
  exclude_models?: string;
}
export interface FetchRelatedProductsParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  search?: string;
  category?: string;
  tags?: string;
  model?: string;
  priceRange?: string; // format: min-max
  exclude_models?: string;
  product_id?: string;
}
export interface FetchProductsResponse {
  products: any[];
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
  fetchAllProducts: async ({ 
      limit = 20, page = 1, sort = 'product_id', 
      order = 'ASC', search = '', category, tags, model, priceRange, exclude_models
    }: FetchProductsParams): Promise<FetchProductsResponse> => {
    try {
      const offset = (page - 1) * parseInt(limit+'');
      const values: any[] = [];

      const baseQuery = `
        FROM ${tables.product} prod
        JOIN ${tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        LEFT JOIN ${tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        WHERE prod.status = 1 
      `;

      let whereClause = '';
      if (search) {
        whereClause = ` AND (prod.model LIKE ? OR prod_desc.name LIKE ?)`;
        values.push(`%${search}%`, `%${search}%`);
      }
      if (model) {
        whereClause += ` AND prod.model LIKE ?`;
        values.push(`%${model}%`);
      }
      if (exclude_models) {
        whereClause += ` AND prod.model NOT LIKE ?`;
        values.push(`%${exclude_models}%`);
      }
      if (category && category) {
        // whereClause += ` AND prod_to_cat.category_id IN (${category})`;
        // values.push(category);
        const catsConditions: string[] = [];
        category.split(',').forEach((cat: string) => {
          if (!Number.isNaN(parseInt(cat))) {
            catsConditions.push(`prod_to_cat.category_id = ${cat}`);
          }
        });
        if (catsConditions.length > 0) {
          whereClause += ` AND (${catsConditions.join(' OR ')})`;
        }
      }
      if (tags && tags !== '') {
        const tagConditions: string[] = [];
        tags.split(',').forEach((tag: string) => {
          tagConditions.push(`prod_desc.tag LIKE '%${tag}%'`);
        });
        if (tagConditions.length > 0) {
          whereClause += ` AND (${tagConditions.join(' OR ')})`;
        }
      }
      if (priceRange) {
        // Filter by prod.price or prod_discount.price if it exists
        const [min, max] = priceRange.split('-');
        whereClause += ` AND (prod.price BETWEEN ${min} AND ${max} OR prod_discount.price BETWEEN ${min} AND ${max})`;
      }

      const query = `
        SELECT 
          MAX(prod_desc.name)AS title,
          max(prod_desc.description) AS description,
          prod.*,
          prod.product_id AS id,
          MAX(prod_discount.price) AS discount_price,
          prod.image AS image,
          prod.image AS imageUrl,
          MAX(cat_desc.name) AS category_name,
          MAX(cat_desc.name) AS level,
          MAX(cat_desc.description) AS category_description,
          MAX(prod_desc.tag) AS tags,
          MAX(prod_to_cat.category_id) AS category_id
        ${baseQuery}
        ${whereClause}
        GROUP BY prod.product_id
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
      values.push(parseInt(limit+''), offset);

      const countQuery = `
        SELECT COUNT(*) as total
        ${baseQuery}
        ${whereClause}
      `;
      // console.log('Query:', query);
      const [results]: any = await pool.query(query, values);
      const [countResults]: any = await pool.query(countQuery, values.slice(0, -2)); // exclude limit & offset
      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);
      return {
        products: results,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      console.error('[Model] Error fetching products:', error);
      throw error;
    }
  },
  fetchProductById: async (productId: number): Promise<any> => {
    try {
      const query = `
        SELECT 
          prod_desc.name AS title,
          prod_desc.description AS description,
          prod.*,
          prod.product_id AS id,
          prod_discount.price AS discount_price,
          prod.image AS image,
          prod.image AS imageUrl,
          cat_desc.name AS category_name,
          cat_desc.name AS level,
          cat_desc.description AS category_description,
          prod_desc.tag AS tags,
          prod_desc.meta_description AS meta_description,
          prod_desc.meta_title AS meta_title,
          prod_desc.meta_keyword AS meta_keyword
        FROM ${tables.product} prod
        JOIN ${tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        LEFT JOIN ${tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        WHERE prod.product_id = ?
      `;
      const [results]: any = await pool.query(query, [productId]);
      return results[0];
    } catch (error) {
      console.error('[Model] Error fetching product by ID:', error);
      throw error;
    }
  },
  fetchFeaturedProducts: async ({ limit = 4, page = 1, model }: FetchProductsParams): Promise<FetchProductsResponse> => {
    const offset = (page - 1) * parseInt(limit+'');
    try {
      // 1. Get featured modules
      const [rows]: any = await pool.query(`
        SELECT setting FROM ${tables.module} 
        WHERE code = 'opencart.featured'
      `);

      // 2. Extract and combine product IDs
      const productIds = rows.flatMap((row: any) => {
          try {
            const parsed = JSON.parse(row.setting);
            return parsed.product || [];
          } catch (err) {
            console.warn('Invalid JSON in featured module setting:', err);
            return [];
          }
        })
        .map((id: string) => parseInt(id))
        .filter((id: any) => !isNaN(id));

      if (productIds.length === 0) return { products: [], total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPreviousPage: false, nextPage: null, previousPage: null };

      // 3. Build query
      const placeholders = productIds.map(() => '?').join(', ');
      const values = [...productIds];
      let whereClause = `WHERE prod.status = 1 AND prod.product_id IN (${placeholders}) `;

      if (model) {
        whereClause += `AND prod.model LIKE ?`;
        values.push(`%${model}%`);
      }

      const [products]: any = await pool.query(`
        SELECT 
          MAX(prod_desc.name) AS title,
          MAX(prod_desc.description) AS description,
          prod.*,
          prod.product_id AS id,
          MAX(prod_discount.price) AS discount_price,
          prod.image AS image,
          prod.image AS imageUrl,
          MAX(cat_desc.name) AS category_name,
          MAX(cat_desc.name) AS level,
          MAX(cat_desc.description) AS category_description
        FROM ${tables.product} prod
        JOIN ${tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        LEFT JOIN ${tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        ${whereClause}
        GROUP BY prod.product_id
        LIMIT ? OFFSET ?
      `, [...values, parseInt(limit+''), offset]);
      
      return {
        products,
        total: products.length,
        page,
        limit,
        totalPages: Math.ceil(products.length / limit),
        hasNextPage: offset + limit < products.length,
        hasPreviousPage: offset > 0,
        nextPage: offset + limit < products.length ? page + 1 : null,
        previousPage: offset > 0 ? page - 1 : null,
      };
    } catch (err) {
      console.error('Error fetching featured products:', err);
      throw err;
    }
  },
  fetchProductImages: async (productId: number) => {
    try {
      const [results]: any = await pool.query(`
        SELECT * FROM ${tables.product_image}
        WHERE product_id = ?
      `, [productId]);
      return results;
    } catch (error) {
      console.error('[Model] Error fetching product images:', error);
      throw error;
    }
  },
  fetchRelatedProducts: async ({
    page=1, limit=4, search, category, tags, model, priceRange, exclude_models, product_id, sort='prod.product_id', order='DESC'
  }: FetchRelatedProductsParams): Promise<FetchProductsResponse> => {
    try {
      const offset = (page - 1) * parseInt(limit+'');
      const values: any[] = [product_id];

      const baseQuery = `
        FROM ${tables.product_related} prod_rel
        JOIN ${tables.product} prod ON prod_rel.related_id = prod.product_id
        JOIN ${tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        LEFT JOIN ${tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        WHERE prod.status = 1 AND prod_rel.product_id = ?
      `;

      let whereClause = '';
      if (search) {
        whereClause = ` AND (prod.model LIKE ? OR prod_desc.name LIKE ?)`;
        values.push(`%${search}%`, `%${search}%`);
      }
      if (model) {
        whereClause += ` AND prod.model LIKE ?`;
        values.push(`%${model}%`);
      }
      if (exclude_models) {
        whereClause += ` AND prod.model NOT LIKE ?`;
        values.push(`%${exclude_models}%`);
      }
      if (category && category) {
        // whereClause += ` AND prod_to_cat.category_id IN (${category})`;
        // values.push(category);
        const catsConditions: string[] = [];
        category.split(',').forEach((cat: string) => {
          if (!Number.isNaN(parseInt(cat))) {
            catsConditions.push(`prod_to_cat.category_id = ${cat}`);
          }
        });
        if (catsConditions.length > 0) {
          whereClause += ` AND (${catsConditions.join(' OR ')})`;
        }
      }
      if (tags && tags !== '') {
        const tagConditions: string[] = [];
        tags.split(',').forEach((tag: string) => {
          tagConditions.push(`prod_desc.tag LIKE '%${tag}%'`);
        });
        if (tagConditions.length > 0) {
          whereClause += ` AND (${tagConditions.join(' OR ')})`;
        }
      }
      if (priceRange) {
        // Filter by prod.price or prod_discount.price if it exists
        const [min, max] = priceRange.split('-');
        whereClause += ` AND (prod.price BETWEEN ${min} AND ${max} OR prod_discount.price BETWEEN ${min} AND ${max})`;
      }

      const query = `
        SELECT 
          MAX(prod_desc.name)AS title,
          max(prod_desc.description) AS description,
          prod.*,
          prod.product_id AS id,
          MAX(prod_discount.price) AS discount_price,
          prod.image AS image,
          prod.image AS imageUrl,
          MAX(cat_desc.name) AS category_name,
          MAX(cat_desc.name) AS level,
          MAX(cat_desc.description) AS category_description,
          MAX(prod_desc.tag) AS tags,
          MAX(prod_to_cat.category_id) AS category_id
        ${baseQuery}
        ${whereClause}
        GROUP BY prod.product_id
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
      values.push(parseInt(limit+''), offset);

      const countQuery = `
        SELECT COUNT(*) as total
        ${baseQuery}
        ${whereClause}
      `;
      // console.log('Query:', query);
      const [results]: any = await pool.query(query, values);
      const [countResults]: any = await pool.query(countQuery, values.slice(0, -2)); // exclude limit & offset
      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);
      return {
        products: results,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      console.error('[Model] Error fetching related products:', error);
      throw error;
    }
  }
};
