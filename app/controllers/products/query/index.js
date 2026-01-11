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
exports.productQueryControllers = void 0;
const products_1 = __importDefault(require("../../../models/products"));
exports.productQueryControllers = {
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.query;
            console.log('Params:', params);
            // Logic to get all products
            const products = yield products_1.default.fetchAllProducts(params);
            res.status(200).json({ Message: "All products fetched successfully", Data: products });
        }
        catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Failed to fetch products" });
        }
    }),
    getProductById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            const product = yield products_1.default.fetchProductById(productId);
            if (!product) {
                return res.status(404).json({ Message: "Product not found" });
            }
            res.status(200).json({ Message: `Product with ID ${productId} fetched successfully`, Data: product });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch product" });
        }
    }),
    getProductBySlug: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productSlug = req.params.productSlug;
            const product = yield products_1.default.fetchProductBySlug(productSlug);
            if (!product) {
                return res.status(404).json({ Message: "Product not found" });
            }
            res.status(200).json({ Message: `Product with ID ${productSlug} fetched successfully`, Data: product });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch product" });
        }
    }),
    getFeaturedProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.query;
            const featuredProducts = yield products_1.default.fetchFeaturedProducts(params);
            res.status(200).json({ Message: "Featured products fetched successfully", Data: featuredProducts });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch featured products" });
        }
    }),
    getProductImages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            const productImages = yield products_1.default.fetchProductImages(productId);
            if (!productImages) {
                return res.status(404).json({ Message: "Product images not found" });
            }
            res.status(200).json({ Message: `Product images with ID ${productId} fetched successfully`, Data: productImages });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch product images" });
        }
    }),
    getRelatedProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            if (!productId) {
                return res.status(400).json({ Message: "Product ID is required" });
            }
            const params = req.query;
            const relatedProducts = yield products_1.default.fetchRelatedProducts(Object.assign({ product_id: productId }, params));
            if (!relatedProducts) {
                return res.status(404).json({ Message: "Related products not found" });
            }
            res.status(200).json({ Message: `Related products with ID ${productId} fetched successfully`, Data: relatedProducts });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch related products" });
        }
    }),
    getProductSlugs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productSlugs = yield products_1.default.fetchAllSlugs();
            res.status(200).json({ Message: "Product slugs fetched successfully", Data: productSlugs });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch product slugs" });
        }
    })
};
