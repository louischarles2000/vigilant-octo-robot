import express from "express";
import reviewHandlers from "../../controllers/reviews"

const router = express.Router();

router.get("/", reviewHandlers.reviewQueryControllers.getAllReviews);
router.get("/:id", reviewHandlers.reviewQueryControllers.getReviewById);

export { router as reviewRouter };