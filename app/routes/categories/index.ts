import express from "express";
import categoryHandlers from "../../controllers/categories"

const router = express.Router();

router.get("/", categoryHandlers.categoryQueryControllers.getAllCategories);
router.get("/:id", categoryHandlers.categoryQueryControllers.getCategoryById);

export { router as categoryRouter };