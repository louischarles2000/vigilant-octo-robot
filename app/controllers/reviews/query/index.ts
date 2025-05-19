import reviewsService, { FetchReviewsParams } from '../../../models/reviews';

export const reviewQueryControllers = {
    getAllReviews: async (req: any, res: any) => {
        try {
          const params: FetchReviewsParams = req.query;
          // Logic to get all products
          const reviews = await reviewsService.fetchAllReviews(params);
          res.status(200).json({ Message: "All reviews fetched successfully", Data: reviews });
        } catch (error) {
          console.error("Error fetching reviews:", error);
          res.status(500).json({ error: "Failed to fetch reviews" });
        }
    },
    getReviewById: async (req: any, res: any) => {
        try {
            const reviewId = req.params.id;
            const review = await reviewsService.fetchReviewById(reviewId);
            if (!review) {
                return res.status(404).json({ Message: "Review not found" });
            }
            res.status(200).json({ Message: `Review with ID ${reviewId} fetched successfully`, Data: review });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch Review" });
        }
    },
};