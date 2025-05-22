import { sendEmail } from "../utils/email_utils";

export interface Contact {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default {
    sendContact: async (contact: Contact) => {
        console.log(contact);
        try {
            await sendEmail({
                // to: contact.email,
                to: process.env.SEND_TO_EMAIL!,
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
        } catch (error) {
            console.error("Failed to send contact email:", error);
            // Optionally, you can send an error response here
        }
    }
};