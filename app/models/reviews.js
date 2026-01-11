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
    fetchAllReviews: (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 4, page = 1, sort = 'rv.rating', order = 'DESC', search = '', customer_id, product_id, rating }) {
        try {
            const offset = (page - 1) * parseInt(limit + '');
            const values = [];
            const baseQuery = `
        FROM ${helpers_1.tables.reviews} rv
        JOIN ${helpers_1.tables.product_description} prod_desc ON rv.product_id = prod_desc.product_id
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
            const [results] = yield db_1.default.query(query, values);
            const [countResults] = yield db_1.default.query(`SELECT COUNT(*) AS total ${baseQuery}`, values);
            const total = countResults[0].total;
            const totalPages = Math.ceil(total / parseInt(limit + ''));
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
        }
        catch (error) {
            console.error('[Model] Error fetching reviews:', error);
            throw error;
        }
    }),
    fetchReviewById: (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT
          rv.*,
          prod_desc.name AS product_name
        FROM ${helpers_1.tables.reviews} rv
        JOIN ${helpers_1.tables.product_description} prod_desc ON rv.product_id = prod_desc.product_id
        WHERE rv.review_id = ?
      `;
            const [results] = yield db_1.default.query(query, [reviewId]);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching review by ID:', error);
            throw error;
        }
    })
};
