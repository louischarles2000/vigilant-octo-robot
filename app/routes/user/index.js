"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../controllers/index"));
const router = express_1.default.Router();
exports.userRouter = router;
router.get("/", index_1.default.userControllers.userQueryControllers);
router.put("/update/:id", index_1.default.userControllers.userMutationControllers);
