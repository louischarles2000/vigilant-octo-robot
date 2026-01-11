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
exports.articleQueryControllers = void 0;
const articles_1 = __importDefault(require("../../../models/articles"));
exports.articleQueryControllers = {
    getAllArticles: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.query;
            // Logic to get all products
            const articles = yield articles_1.default.fetchAllArticles(params);
            res.status(200).json({ Message: "All reviews fetched successfully", Data: articles });
        }
        catch (error) {
            console.error("Error fetching articles:", error);
            res.status(500).json({ error: "Failed to fetch articles" });
        }
    }),
    getArticleById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const articleId = req.params.id;
            const article = yield articles_1.default.fetchArticleById(articleId);
            if (!article) {
                return res.status(404).json({ Message: "Article not found" });
            }
            res.status(200).json({ Message: `Article with ID ${articleId} fetched successfully`, Data: article });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch Article" });
        }
    }),
};
