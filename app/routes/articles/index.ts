import express from "express";
import articleHandlers from "../../controllers/articles"

const router = express.Router();

router.get("/", articleHandlers.articleQueryControllers.getAllArticles);
router.get("/:id", articleHandlers.articleQueryControllers.getArticleById);

export { router as articleRouter };