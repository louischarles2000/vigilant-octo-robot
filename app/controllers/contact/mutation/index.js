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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMutationControllers = void 0;
const contact_1 = __importDefault(require("../../../models/contact"));
exports.contactMutationControllers = {
    createContact: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, subject, message } = req.body;
            // Logic to create a contact
            const contact = yield contact_1.default.sendContact({ name, email, subject, message });
            res.status(201).json({ message: "Contact created successfully", contact });
        }
        catch (error) {
            console.error("Error creating contact:", error);
            res.status(500).json({ error: "Failed to create contact" });
        }
    })
};
