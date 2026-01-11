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
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// import User from "../models/us";
dotenv_1.default.config();
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access token missing or invalid' });
        return;
    }
    const accessToken = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.email = decoded.email;
        req.token = accessToken;
        // const user = await User.findOne({ where: { email: req.email } });
        const user = {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            email: req.email,
            role_id: "admin"
        }; // Mocked user for demonstration
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        req.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id
        };
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        res.status(403).json({ message: 'Invalid access token' });
    }
});
exports.verifyJWT = verifyJWT;
