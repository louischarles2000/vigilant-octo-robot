"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../controllers/auth"));
const router = express_1.default.Router();
exports.authRouter = router;
router.post("/create", auth_1.default.authMutationController);
router.post("/login", auth_1.default.authMutationController);
