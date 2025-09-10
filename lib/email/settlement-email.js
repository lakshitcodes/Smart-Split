import React from "react";
import { formatCurrency } from "../formatCurrency";

export default function generateSettlementMail({ whoPaid, amountPaid, payerEmail, groupName, note }) {
    const isGroupExpense = Boolean(groupName);
    const isNote = Boolean(note);
    return `
  <div style="background-color: #f9fafb; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header with Logo -->
      <div style="background: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <img src="https://smart-split-lakshit.vercel.app/logos/logo.png" alt="SmartSplit" style="height: 50px; background-color: #ffffff; padding: 6px; border-radius: 8px;">
      </div>

      <!-- Settlement Notification Title -->
      <div style="text-align: center; font-size: 22px; font-weight: 700; margin: 24px 0 0 0; color: #059669; letter-spacing: -1px;">
        Settlement Notification
      </div>

      <!-- Content -->
      <div style="padding: 24px 32px;">
        <p style="color: #374151; font-size: 17px; text-align: center; margin-bottom: 24px;">
          <span style="font-weight: 600;">${whoPaid}</span> has successfully settled an expense.
        </p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
          <p style="color: #111827; font-size: 15px; margin: 0 0 8px 0;"><span style="font-weight: 600;">Payer Name:</span> ${whoPaid}</p>
          <p style="color: #111827; font-size: 15px; margin: 0 0 8px 0;"><span style="font-weight: 600;">Amount Paid:</span> ${formatCurrency(amountPaid)}</p>
          <p style="color: #111827; font-size: 15px; margin: 0 0 8px 0;"><span style="font-weight: 600;">Payer Email:</span> ${payerEmail}</p>
          ${isGroupExpense ? `<p style=\"color: #111827; font-size: 15px; margin: 0;\"><span style=\"font-weight: 600;\">Group Expense:</span> This settlement was made in group <span style=\"font-style: italic;\">${groupName}</span></p>` : ""}
          ${isNote ? `<p style="color: #111827; font-size: 15px; margin: 8px 0 0 0;"><span style="font-weight: 600;">Note:</span> ${note}</p>` : ""}
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This payment has been recorded in your account. Please keep this confirmation for future reference.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:  linear-gradient(90deg, #059669 0%, #22c55e 100%); padding: 16px; text-align: center; font-size: 13px; color: white;">
        © ${new Date().getFullYear()} SmartSplit. All rights reserved.
      </div>

    </div>
  </div>`;
}
