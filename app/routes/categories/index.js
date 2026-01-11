"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const categories_1 = __importDefault(require("../../controllers/categories"));
const router = express_1.default.Router();
exports.categoryRouter = router;
router.get("/", categories_1.default.categoryQueryControllers.getAllCategories);
router.get("/:id", categories_1.default.categoryQueryControllers.getCategoryById);
