// services/emailService.ts
import { transporter } from "@/config/nodemailConfig";
import { ENV } from "@/types/envSchema";
import { ContactUsSchema } from "@/types/otherFormsSchema";
import logger from "@/utils/chalkLogger";
import { SendMailOptions } from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

/**
 * Send an email using the transporter
 * @param {SendMailOptions} mailOptions
 * @returns {Promise<void>}
 */
export const sendEmail = async (
    mailOptions: SendMailOptions
): Promise<void> => {
    return await transporter.sendMail(mailOptions);
};
/**
 * Subscription email data type.
 */
export type SubscriptionData = {
    email: string;
    interests?: string;
};

/**
 * Send a "Contact Us" email.
 * @param {ContactUsSchema} contact - The contact email data.
 * @returns {Promise<void>}
 */
export const sendContactEmail = async (
    contact: ContactUsSchema
): Promise<void> => {
    const subject = `Email from ${contact.name} from the contact form`;
    const htmlContent = `
    <img src="cid:logo.png" alt="logo"/>
    <h1>New Contact Message from ${contact.name}</h1>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Subject:</strong>Email from ${contact.name} from the contact form</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message}</p>
  `;
    const attachments: Attachment[] = [
        {
            filename: "logo.svg",
            path: "public/images/Logomark.png",
            cid: "logo.png",
        },
    ];

    const mailOptions: SendMailOptions = {
        from: ENV.ZOHO_SMTP_USERNAME
            ? `Learnrithm AI <${ENV.ZOHO_SMTP_USERNAME}>`
            : "support@learnrithm.com",
        // Route the contact message to a dedicated receiver.
        to: process.env.CONTACT_US_RECEIVER || "contact@learnrithm.com",
        subject,
        html: htmlContent,
        attachments,
    };

    const mailInfo: import("nodemailer").SentMessageInfo = await sendEmail(mailOptions);
    logger.info(
        `Contact email sent: ${mailInfo.response || "No response"} for message from ${contact.email}`
    );
};
