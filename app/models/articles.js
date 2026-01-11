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
    fetchAllArticles: (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 4, page = 1, sort = 'art.date_added', order = 'DESC', search = '', language_id }) {
        try {
            const offset = (page - 1) * parseInt(limit + '');
            const values = [];
            const baseQuery = `
        FROM ${helpers_1.tables.articles} art
        JOIN ${helpers_1.tables.article_description} art_desc ON art.article_id = art_desc.article_id
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
            const [results] = yield db_1.default.query(query, values);
            const [countResults] = yield db_1.default.query(`SELECT COUNT(*) AS total ${baseQuery}`, values);
            const total = countResults[0].total;
            const totalPages = Math.ceil(total / parseInt(limit + ''));
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
        }
        catch (error) {
            console.error('[Model] Error fetching articles:', error);
            throw error;
        }
    }),
    fetchArticleById: (articleId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT
          art.*,
          art_desc.*
        FROM ${helpers_1.tables.articles} art
        JOIN ${helpers_1.tables.article_description} art_desc ON art.article_id = art_desc.article_id
        WHERE art.article_id = ?
      `;
            const [results] = yield db_1.default.query(query, [articleId]);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching article by ID:', error);
            throw error;
        }
    })
};
