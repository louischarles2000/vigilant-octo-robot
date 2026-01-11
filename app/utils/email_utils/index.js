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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(mailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        try {
            let info = yield transporter.sendMail(Object.assign({ from: process.env.EMAIL_USER }, mailOptions));
            console.log("Message sent: %s", info.messageId);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    });
}
