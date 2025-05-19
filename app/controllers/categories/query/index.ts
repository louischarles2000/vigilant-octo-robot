import categoriesService, { FetchCategoriesParams } from '../../../models/categories';

export const categoryQueryControllers = {
    getAllCategories: async (req: any, res: any) => {
        try {
          const params: FetchCategoriesParams = req.query;
          // Logic to get all products
          const categories = await categoriesService.fetchAllCategories(params);
          res.status(200).json({ Message: "All categories fetched successfully", Data: categories });
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).json({ error: "Failed to fetch categories" });
        }
    },
    getCategoryById: async (req: any, res: any) => {
        try {
            const categoryId = req.params.id;
            const category = await categoriesService.fetchCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ Message: "Category not found" });
            }
            res.status(200).json({ Message: `Category with ID ${categoryId} fetched successfully`, Data: category });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch category" });
        }
    },
};