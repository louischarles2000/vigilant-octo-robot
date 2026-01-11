"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRouter = void 0;
const express_1 = __importDefault(require("express"));
const roles_1 = __importDefault(require("../../controllers/roles"));
const verifyJWT_1 = require("../../middlewares/verifyJWT");
const verifyRoles_1 = __importDefault(require("../../middlewares/verifyRoles"));
const router = express_1.default.Router();
exports.rolesRouter = router;
router.get("/", verifyJWT_1.verifyJWT, (0, verifyRoles_1.default)(['ec8230fa-d069-497d-b1d4-356d3b037b17']), roles_1.default.rolesQueryControllers);
