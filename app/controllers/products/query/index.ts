import productsService, { FetchProductsParams } from '../../../models/products';

export const productQueryControllers = {
    getAllProducts: async (req: any, res: any) => {
        try {
          const params: FetchProductsParams = req.query;
          console.log('Params:', params);
          // Logic to get all products
          const products = await productsService.fetchAllProducts(params);
          res.status(200).json({ Message: "All products fetched successfully", Data: products });
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).json({ error: "Failed to fetch products" });
        }
    },
    getProductById: async (req: any, res: any) => {
        try {
            const productId = req.params.id;
            const product = await productsService.fetchProductById(productId);
            if (!product) {
                return res.status(404).json({ Message: "Product not found" });
            }
            res.status(200).json({ Message: `Product with ID ${productId} fetched successfully`, Data: product });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch product" });
        }
    },
    getProductBySlug: async (req: any, res: any) => {
        try {
            const productSlug = req.params.productSlug;
            const product = await productsService.fetchProductBySlug(productSlug);
            if (!product) {
                return res.status(404).json({ Message: "Product not found" });
            }
            res.status(200).json({ Message: `Product with ID ${productSlug} fetched successfully`, Data: product });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch product" });
        }
    },
    getFeaturedProducts: async (req: any, res: any) => {
        try {
            const params: FetchProductsParams = req.query;
            const featuredProducts = await productsService.fetchFeaturedProducts(params);
            res.status(200).json({ Message: "Featured products fetched successfully", Data: featuredProducts });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch featured products" });
        }
    },
    getProductImages: async (req: any, res: any) => {
        try {
            const productId = req.params.id;
            const productImages = await productsService.fetchProductImages(productId);
            if (!productImages) {
                return res.status(404).json({ Message: "Product images not found" });
            }
            res.status(200).json({ Message: `Product images with ID ${productId} fetched successfully`, Data: productImages });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch product images" });
        }
    },
    getRelatedProducts: async (req: any, res: any) => {
        try {
            const productId = req.params.id;
            if (!productId) {
                return res.status(400).json({ Message: "Product ID is required" });
            }
            const params: FetchProductsParams = req.query;
            const relatedProducts = await productsService.fetchRelatedProducts({product_id: productId, ...params});
            if (!relatedProducts) {
                return res.status(404).json({ Message: "Related products not found" });
            }
            res.status(200).json({ Message: `Related products with ID ${productId} fetched successfully`, Data: relatedProducts });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch related products" });
        }
    }
};