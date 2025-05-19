export const productMutationControllers = {
    createProduct: async (req: any, res: any) => {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully" });
    },
    updateProduct: async (req: any, res: any) => {
        // Logic to update a product
        res.status(200).json({ message: "Product updated successfully" });
    },
    deleteProduct: async (req: any, res: any) => {
        // Logic to delete a product
        res.status(200).json({ message: "Product deleted successfully" });
    }
};