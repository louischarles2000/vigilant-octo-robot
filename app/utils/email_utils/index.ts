import nodemailer from 'nodemailer';

// Define a type for your email options
interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

async function sendEmail(mailOptions: EmailOptions) {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            ...mailOptions, // Spread operator to include dynamic options
        });

        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

export { sendEmail };