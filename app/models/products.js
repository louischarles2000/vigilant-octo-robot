"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const helpers_1 = require("../utils/helpers");
exports.default = {
    fetchAllProducts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 20, page = 1, sort = 'product_id', order = 'ASC', search = '', category, tags, model, priceRange, exclude_models }) {
        try {
            const offset = (page - 1) * parseInt(limit + '');
            const values = [];
            const baseQuery = `
        FROM ${helpers_1.tables.product} prod
        JOIN ${helpers_1.tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        JOIN ${helpers_1.tables.seo_url} seo ON prod.product_id = seo.value AND seo.key = 'product_id'
        LEFT JOIN ${helpers_1.tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${helpers_1.tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${helpers_1.tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
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
                const catsConditions = [];
                category.split(',').forEach((cat) => {
                    if (!Number.isNaN(parseInt(cat))) {
                        catsConditions.push(`prod_to_cat.category_id = ${cat}`);
                    }
                });
                if (catsConditions.length > 0) {
                    whereClause += ` AND (${catsConditions.join(' OR ')})`;
                }
            }
            if (tags && tags !== '') {
                const tagConditions = [];
                tags.split(',').forEach((tag) => {
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
          MAX(prod_to_cat.category_id) AS category_id,
          MAX(LOWER(seo.keyword)) AS slug
        ${baseQuery}
        ${whereClause}
        GROUP BY prod.product_id
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
            values.push(parseInt(limit + ''), offset);
            const countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT DISTINCT prod.product_id
          ${baseQuery}
          ${whereClause}
        ) AS sub
      `;
            const [countResults] = yield db_1.default.query(countQuery, values.slice(0, -2)); // exclude limit & offset
            // console.log('Query:', query);
            const [results] = yield db_1.default.query(query, values);
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
        }
        catch (error) {
            console.error('[Model] Error fetching products:', error);
            throw error;
        }
    }),
    fetchProductById: (productId) => __awaiter(void 0, void 0, void 0, function* () {
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
          prod_desc.meta_keyword AS meta_keyword,
          LOWER(seo.keyword) AS slug,
          prod_to_cat.category_id AS category_id
        FROM ${helpers_1.tables.product} prod
        JOIN ${helpers_1.tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        JOIN ${helpers_1.tables.seo_url} seo ON prod.product_id = seo.value AND seo.key = 'product_id'
        LEFT JOIN ${helpers_1.tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${helpers_1.tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${helpers_1.tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        WHERE prod.product_id = ?
      `;
            const [results] = yield db_1.default.query(query, [productId]);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching product by ID:', error);
            throw error;
        }
    }),
    fetchProductBySlug: (slug) => __awaiter(void 0, void 0, void 0, function* () {
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
          prod_desc.meta_keyword AS meta_keyword,
          LOWER(seo.keyword) AS slug,
          prod_to_cat.category_id AS category_id
        FROM ${helpers_1.tables.product} prod
        JOIN ${helpers_1.tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        JOIN ${helpers_1.tables.seo_url} seo ON prod.product_id = seo.value AND seo.key = 'product_id'
        LEFT JOIN ${helpers_1.tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${helpers_1.tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${helpers_1.tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        WHERE seo.keyword = ?
      `;
            const [results] = yield db_1.default.query(query, [slug]);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching product by ID:', error);
            throw error;
        }
    }),
    fetchAllSlugs: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT 
          LOWER(seo.keyword) AS slug
        FROM ${helpers_1.tables.seo_url} seo
        JOIN ${helpers_1.tables.product} prod ON seo.value = prod.product_id
        WHERE seo.key = 'product_id' AND prod.status = 1
        LIMIT 1000
      `;
            const [results] = yield db_1.default.query(query);
            return results;
        }
        catch (error) {
            console.error('[Model] Error fetching slugs:', error);
            throw error;
        }
    }),
    fetchFeaturedProducts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 4, page = 1, model }) {
        const offset = (page - 1) * parseInt(limit + '');
        try {
            // 1. Get featured modules
            const [rows] = yield db_1.default.query(`
        SELECT setting FROM ${helpers_1.tables.module} 
        WHERE code = 'opencart.featured'
      `);
            // 2. Extract and combine product IDs
            const productIds = rows.flatMap((row) => {
                try {
                    const parsed = JSON.parse(row.setting);
                    return parsed.product || [];
                }
                catch (err) {
                    console.warn('Invalid JSON in featured module setting:', err);
                    return [];
                }
            })
                .map((id) => parseInt(id))
                .filter((id) => !isNaN(id));
            if (productIds.length === 0)
                return { products: [], total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPreviousPage: false, nextPage: null, previousPage: null };
            // 3. Build query
            const placeholders = productIds.map(() => '?').join(', ');
            const values = [...productIds];
            let whereClause = `WHERE prod.status = 1 AND prod.product_id IN (${placeholders}) `;
            if (model) {
                whereClause += `AND prod.model LIKE ?`;
                values.push(`%${model}%`);
            }
            const [products] = yield db_1.default.query(`
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
          MAX(cat_desc.description) AS category_description,
          MAX(prod_desc.tag) AS tags,
          MAX(LOWER(seo.keyword)) AS slug,
          MAX(prod_to_cat.category_id) AS category_id
        FROM ${helpers_1.tables.product} prod
        JOIN ${helpers_1.tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        JOIN ${helpers_1.tables.seo_url} seo ON prod.product_id = seo.value AND seo.key = 'product_id'
        LEFT JOIN ${helpers_1.tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${helpers_1.tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${helpers_1.tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
        ${whereClause}
        GROUP BY prod.product_id
        LIMIT ? OFFSET ?
      `, [...values, parseInt(limit + ''), offset]);
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
        }
        catch (err) {
            console.error('Error fetching featured products:', err);
            throw err;
        }
    }),
    fetchProductImages: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [results] = yield db_1.default.query(`
        SELECT * FROM ${helpers_1.tables.product_image}
        WHERE product_id = ?
      `, [productId]);
            return results;
        }
        catch (error) {
            console.error('[Model] Error fetching product images:', error);
            throw error;
        }
    }),
    fetchRelatedProducts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 4, search, category, tags, model, priceRange, exclude_models, product_id, sort = 'prod.product_id', order = 'DESC' }) {
        try {
            const offset = (page - 1) * parseInt(limit + '');
            const values = [product_id];
            const baseQuery = `
        FROM ${helpers_1.tables.product_related} prod_rel
        JOIN ${helpers_1.tables.product} prod ON prod_rel.related_id = prod.product_id
        JOIN ${helpers_1.tables.product_description} prod_desc ON prod.product_id = prod_desc.product_id
        JOIN ${helpers_1.tables.seo_url} seo ON prod.product_id = seo.value AND seo.key = 'product_id'
        LEFT JOIN ${helpers_1.tables.product_to_category} prod_to_cat ON prod.product_id = prod_to_cat.product_id
        LEFT JOIN ${helpers_1.tables.category_description} cat_desc ON prod_to_cat.category_id = cat_desc.category_id
        LEFT JOIN ${helpers_1.tables.product_discount} prod_discount ON prod.product_id = prod_discount.product_id
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
                const catsConditions = [];
                category.split(',').forEach((cat) => {
                    if (!Number.isNaN(parseInt(cat))) {
                        catsConditions.push(`prod_to_cat.category_id = ${cat}`);
                    }
                });
                if (catsConditions.length > 0) {
                    whereClause += ` AND (${catsConditions.join(' OR ')})`;
                }
            }
            if (tags && tags !== '') {
                const tagConditions = [];
                tags.split(',').forEach((tag) => {
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
          MAX(prod_to_cat.category_id) AS category_id,
          MAX(LOWER(seo.keyword)) AS slug
        ${baseQuery}
        ${whereClause}
        GROUP BY prod.product_id
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
            values.push(parseInt(limit + ''), offset);
            const countQuery = `
        SELECT COUNT(*) as total
        ${baseQuery}
        ${whereClause}
      `;
            // console.log('Query:', query);
            const [results] = yield db_1.default.query(query, values);
            const [countResults] = yield db_1.default.query(countQuery, values.slice(0, -2)); // exclude limit & offset
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
        }
        catch (error) {
            console.error('[Model] Error fetching related products:', error);
            throw error;
        }
    })
};
