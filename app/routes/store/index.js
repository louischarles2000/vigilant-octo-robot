"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRouter = void 0;
const express_1 = __importDefault(require("express"));
const store_1 = __importDefault(require("../../controllers/store"));
const router = express_1.default.Router();
exports.storeRouter = router;
router.get("/currency", store_1.default.storeQueryControllers.getStoreCurrency);
