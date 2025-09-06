"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import nodemailer from "nodemailer";
require('dotenv').config();

// Action to send email using Nodemailer
export const sendEmail = action({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
        text: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            // Create transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            });

            // Send mail
            const info = await transporter.sendMail({
                from: `"SmartSplit" <${process.env.MAIL_USER}>`,
                to: args.to,
                subject: args.subject,
                html: args.html,
                text: args.text,
            });

            console.log("Email sent successfully:", info);

            return { success: true, id: info.messageId };
        } catch (error) {
            console.error("Failed to send email:", error);
            return { success: false, error: error.message };
        }
    },
});
