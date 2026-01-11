"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = __importDefault(require("express"));
const contact_1 = __importDefault(require("../../controllers/contact"));
const router = express_1.default.Router();
exports.contactRouter = router;
router.post("/", contact_1.default.contactMutationControllers.createContact);
