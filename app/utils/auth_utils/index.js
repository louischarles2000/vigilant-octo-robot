"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
exports.generateTemporaryPassword = generateTemporaryPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//  Function to generate a refresh token
const generateRefreshToken = () => {
    return jsonwebtoken_1.default.sign({}, "refresh", { expiresIn: "30d" }); // Set the expiration to 30 days
};
exports.generateRefreshToken = generateRefreshToken;
// Helper function to generate a temporary password
function generateTemporaryPassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(10)
        .fill("")
        .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
        .join("");
}
