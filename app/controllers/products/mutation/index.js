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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMutationControllers = void 0;
exports.productMutationControllers = {
    createProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully" });
    }),
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to update a product
        res.status(200).json({ message: "Product updated successfully" });
    }),
    deleteProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to delete a product
        res.status(200).json({ message: "Product deleted successfully" });
    })
};
