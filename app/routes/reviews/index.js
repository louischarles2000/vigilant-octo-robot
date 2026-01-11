"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const reviews_1 = __importDefault(require("../../controllers/reviews"));
const router = express_1.default.Router();
exports.reviewRouter = router;
router.get("/", reviews_1.default.reviewQueryControllers.getAllReviews);
router.get("/:id", reviews_1.default.reviewQueryControllers.getReviewById);
