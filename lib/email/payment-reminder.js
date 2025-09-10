import React from "react";
import { formatCurrency } from "../formatCurrency";

export default function generatePaymentReminderMail({
    owedToName,
    owedToEmail,
    amountOwed,
    note,
    payUrl,
}) {
    const isNote = Boolean(note);
    return `
  <div style="background-color: #f9fafb; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header with Logo -->
      <div style="background: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <img src="https://smart-split-lakshit.vercel.app/logos/logo.png" alt="SmartSplit" style="height: 50px; background-color: #ffffff; padding: 6px; border-radius: 8px;">
      </div>

      <!-- Reminder Title -->
      <div style="text-align: center; font-size: 22px; font-weight: 700; margin: 24px 0 0 0; color: #dc2626; letter-spacing: -1px;">
        Payment Reminder
      </div>

      <!-- Content -->
      <div style="padding: 24px 32px;">
        <p style="color: #374151; font-size: 17px; text-align: center; margin-bottom: 24px;">
          You have an outstanding payment to <span style="font-weight: 600;">${owedToName}</span>.
        </p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
          <p style="color: #111827; font-size: 15px; margin: 0 0 8px 0;"><span style="font-weight: 600;">Owed To:</span> ${owedToName}</p>
          <p style="color: #111827; font-size: 15px; margin: 0 0 8px 0;"><span style="font-weight: 600;">Owed To Email:</span> ${owedToEmail}</p>
          <p style="color: #111827; font-size: 15px; margin: 0;"><span style="font-weight: 600;">Amount Owed:</span> ${formatCurrency(amountOwed)}</p>
          ${isNote ? `<p style="color: #111827; font-size: 15px; margin: 8px 0 0 0;"><span style="font-weight: 600;">Note:</span> ${note}</p>` : ""}
        </div>

        <!-- Pay Now Button -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${payUrl}" style="display: inline-block; background: linear-gradient(90deg, #059669 0%, #22c55e 100%); color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 15px;">
            Pay Now
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Please clear this payment at the earliest. Keeping your balances updated helps everyone stay worry-free.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:  linear-gradient(90deg, #059669 0%, #22c55e 100%); padding: 16px; text-align: center; font-size: 13px; color: white;">
        © ${new Date().getFullYear()} SmartSplit. All rights reserved.
      </div>

    </div>
  </div>`;
}
