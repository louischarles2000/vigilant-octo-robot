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
Object.defineProperty(exports, "__esModule", { value: true });
const email_utils_1 = require("../utils/email_utils");
exports.default = {
    sendContact: (contact) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(contact);
        try {
            yield (0, email_utils_1.sendEmail)({
                // to: contact.email,
                to: process.env.SEND_TO_EMAIL,
                subject: contact.subject,
                // text: `Name: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`,
                html: `
                    <di>
                        <h3>Message from ${contact.name} through contact form.</h3>
                        <p><strong>Name:</strong> ${contact.name}</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Message:</strong> ${contact.message}</p>
                    </div>
                `,
            });
            console.log("Contact email sent successfully.");
            // Optionally, you can send a success response here
        }
        catch (error) {
            console.error("Failed to send contact email:", error);
            // Optionally, you can send an error response here
        }
    })
};
