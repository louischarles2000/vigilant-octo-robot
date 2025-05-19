import articlesService, { FetchArticlesParams } from '../../../models/articles';

export const articleQueryControllers = {
    getAllArticles: async (req: any, res: any) => {
        try {
          const params: FetchArticlesParams = req.query;
          // Logic to get all products
          const articles = await articlesService.fetchAllArticles(params);
          res.status(200).json({ Message: "All reviews fetched successfully", Data: articles });
        } catch (error) {
          console.error("Error fetching articles:", error);
          res.status(500).json({ error: "Failed to fetch articles" });
        }
    },
    getArticleById: async (req: any, res: any) => {
        try {
            const articleId = req.params.id;
            const article = await articlesService.fetchArticleById(articleId);
            if (!article) {
                return res.status(404).json({ Message: "Article not found" });
            }
            res.status(200).json({ Message: `Article with ID ${articleId} fetched successfully`, Data: article });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch Article" });
        }
    },
};