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
    fetchAllCategories: (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 4, page = 1, sort = 'cat.category_id', order = 'DESC', search = '' }) {
        try {
            const offset = (page - 1) * parseInt(limit + '');
            const values = [];
            const baseQuery = `
        FROM ${helpers_1.tables.category} cat
        JOIN ${helpers_1.tables.category_description} cat_desc ON cat.category_id = cat_desc.category_id
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
          (SELECT COUNT(*) FROM ${helpers_1.tables.product_to_category} prod_to_cat WHERE prod_to_cat.category_id = cat.category_id) AS total_products
        ${baseQuery}
        ${whereClause}
        ORDER BY ${sort} ${order}
        LIMIT ${limit}
        OFFSET ${offset}
      `;
            const [results] = yield db_1.default.query(query, values);
            const [countResults] = yield db_1.default.query(`SELECT COUNT(*) AS total ${baseQuery}`, values);
            const total = countResults[0].total;
            const totalPages = Math.ceil(total / parseInt(limit + ''));
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
        }
        catch (error) {
            console.error('[Model] Error fetching categories:', error);
            throw error;
        }
    }),
    fetchCategoryById: (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT 
          cat.*,
          cat_desc.name AS category_name,
          cat_desc.description AS description,
          cat.category_id AS id,
          cat_desc.*
        FROM ${helpers_1.tables.category} cat
        JOIN ${helpers_1.tables.category_description} cat_desc ON cat.category_id = cat_desc.category_id
        WHERE cat.category_id = ?
      `;
            const [results] = yield db_1.default.query(query, [categoryId]);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching category by ID:', error);
            throw error;
        }
    })
};
