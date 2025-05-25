import express from "express";
import productHandlers from "../../controllers/products"

const router = express.Router();

router.get("/", productHandlers.productQueryControllers.getAllProducts);
router.get("/featured", productHandlers.productQueryControllers.getFeaturedProducts);
router.get("/related/:id", productHandlers.productQueryControllers.getRelatedProducts);
router.get("/:id", productHandlers.productQueryControllers.getProductById);
router.get("/slug/:productSlug", productHandlers.productQueryControllers.getProductBySlug);
router.get("/images/:id", productHandlers.productQueryControllers.getProductImages);

router.put("/update/:id", productHandlers.productMutationControllers.updateProduct);

export { router as productsRouter };