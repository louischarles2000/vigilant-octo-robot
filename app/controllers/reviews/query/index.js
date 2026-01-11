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
exports.reviewQueryControllers = void 0;
const reviews_1 = __importDefault(require("../../../models/reviews"));
exports.reviewQueryControllers = {
    getAllReviews: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.query;
            // Logic to get all products
            const reviews = yield reviews_1.default.fetchAllReviews(params);
            res.status(200).json({ Message: "All reviews fetched successfully", Data: reviews });
        }
        catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ error: "Failed to fetch reviews" });
        }
    }),
    getReviewById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reviewId = req.params.id;
            const review = yield reviews_1.default.fetchReviewById(reviewId);
            if (!review) {
                return res.status(404).json({ Message: "Review not found" });
            }
            res.status(200).json({ Message: `Review with ID ${reviewId} fetched successfully`, Data: review });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch Review" });
        }
    }),
};
