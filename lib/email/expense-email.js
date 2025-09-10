import { format } from "date-fns";
import { formatCurrency } from "./../formatCurrency";

export function generateExpenseEmail({ type, creator, group, expense }) {
  return `
  <div style="background-color: #f9fafb; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header with Logo -->
      <div style="background: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <img src="https://smart-split-lakshit.vercel.app/logos/logo.png" alt="SmartSplit" style="height: 50px; background-color: #ffffff; padding: 6px; border-radius: 8px;">
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <h2 style="color: #111827; font-size: 22px; margin-bottom: 16px;">New Expense Added 💸</h2>

        <p style="font-size: 16px; line-height: 1.5;">
          ${type === "group"
      ? `<strong>${creator.name}</strong> added a new expense in <strong>${group?.name || "the group"}</strong>.`
      : `<strong>${creator.name}</strong> added a new expense with you.`}
        </p>

        <!-- Expense Details Card -->
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 8px 0; font-size: 15px;"><strong>Description:</strong> ${expense.description}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Amount:</strong> ${formatCurrency(expense.amount)}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Category:</strong> ${expense.category}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Date:</strong> ${format(expense.date, "PPP")}</p>
        </div>

        <p style="font-size: 14px; color: #374151;">
          Please settle your share at the earliest. If you have any questions, feel free to reach out.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:  linear-gradient(90deg, #059669 0%, #22c55e 100%); padding: 16px; text-align: center; font-size: 13px; color: white;">
        © ${new Date().getFullYear()} SmartSplit. All rights reserved.
      </div>

    </div>
  </div>`;
}

