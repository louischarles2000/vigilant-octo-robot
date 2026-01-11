"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRouter = void 0;
const express_1 = __importDefault(require("express"));
const articles_1 = __importDefault(require("../../controllers/articles"));
const router = express_1.default.Router();
exports.articleRouter = router;
router.get("/", articles_1.default.articleQueryControllers.getAllArticles);
router.get("/:id", articles_1.default.articleQueryControllers.getArticleById);
