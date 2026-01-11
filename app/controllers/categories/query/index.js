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
exports.categoryQueryControllers = void 0;
const categories_1 = __importDefault(require("../../../models/categories"));
exports.categoryQueryControllers = {
    getAllCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.query;
            // Logic to get all products
            const categories = yield categories_1.default.fetchAllCategories(params);
            res.status(200).json({ Message: "All categories fetched successfully", Data: categories });
        }
        catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    }),
    getCategoryById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryId = req.params.id;
            const category = yield categories_1.default.fetchCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ Message: "Category not found" });
            }
            res.status(200).json({ Message: `Category with ID ${categoryId} fetched successfully`, Data: category });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch category" });
        }
    }),
};
