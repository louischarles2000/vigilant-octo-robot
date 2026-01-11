"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { authRouter } from './auth';
// import { rolesRouter } from './roles';
// import { userRouter } from './user';
const products_1 = require("./products");
const categories_1 = require("./categories");
const reviews_1 = require("./reviews");
const articles_1 = require("./articles");
const store_1 = require("./store");
const contact_1 = require("./contact");
const router = express_1.default.Router();
const test_api = '/api/v1';
// Use routes
// router.use(`${test_api}/auth`, authRouter);
// router.use(`${test_api}/roles`, rolesRouter);
// router.use(`${test_api}/users`, userRouter);
router.use(`${test_api}/product`, products_1.productsRouter);
router.use(`${test_api}/category`, categories_1.categoryRouter);
router.use(`${test_api}/review`, reviews_1.reviewRouter);
router.use(`${test_api}/article`, articles_1.articleRouter);
router.use(`${test_api}/store`, store_1.storeRouter);
router.use(`${test_api}/contact`, contact_1.contactRouter);
exports.default = router;
