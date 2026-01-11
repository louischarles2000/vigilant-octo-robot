"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = __importDefault(require("express"));
const products_1 = __importDefault(require("../../controllers/products"));
const router = express_1.default.Router();
exports.productsRouter = router;
router.get("/", products_1.default.productQueryControllers.getAllProducts);
router.get("/featured", products_1.default.productQueryControllers.getFeaturedProducts);
router.get("/related/:id", products_1.default.productQueryControllers.getRelatedProducts);
router.get("/:id", products_1.default.productQueryControllers.getProductById);
router.get("/slug/:productSlug", products_1.default.productQueryControllers.getProductBySlug);
router.get("/images/:id", products_1.default.productQueryControllers.getProductImages);
router.get("/static/slugs", products_1.default.productQueryControllers.getProductSlugs);
router.put("/update/:id", products_1.default.productMutationControllers.updateProduct);
