import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inngest } from "./client";
import { formatCurrency } from "../formatCurrency";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export const paymentReminders = inngest.createFunction(
  { name: "Send Payment Reminders", id: "send-payment-reminders" },
  { cron: "0 10 * * 0" }, // Sunday at 10 AM UTC
  async ({ step }) => {
    /* 1. fetch all users that still owe money */
    const users = await step.run("fetch‑debts", () =>
      convex.query(api.inngest.getUsersWithOutstandingDebts)
    );

    /* 2. build & send one e‑mail per user */
    const results = await step.run("send‑emails", async () => {
      return Promise.all(
        users.map(async (u) => {
          const rows = u.debts
            .map(
              (d) => `
                <tr>
                  <td style="padding:4px 8px;">${d.name}</td>
                  <td style="padding:4px 8px;">${formatCurrency(d.amount)}</td>
                </tr>
              `
            )
            .join("");

          if (!rows) return { userId: u._id, skipped: true };

          const html = `
          <div style="max-width:600px;margin:0 auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;line-height:1.5;">
            <!-- Header -->
            <div style="text-align:center;padding:24px 0;background:linear-gradient(90deg,#059669,#14b8a6);border-radius:12px 12px 0 0;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:white;">SmartSplit</h1>
              <p style="margin:4px 0 0;font-size:14px;color:#d1fae5;">Payments Reminder</p>
            </div>

            <!-- Body -->
            <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
              <p style="font-size:16px;">Hi <strong>${u.name}</strong>,</p>
              <p style="margin-top:8px;font-size:15px;color:#374151;">
                You have the following <span style="font-weight:600;color:#059669;">outstanding balances</span>:
              </p>

              <!-- Debts table -->
              <table style="width:100%;margin-top:16px;border-collapse:separate;border-spacing:0 8px;">
                <thead>
                  <tr style="text-align:left;font-size:14px;color:#6b7280;">
                    <th style="padding:8px;">To</th>
                    <th style="padding:8px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>

              <!-- CTA -->
              <div style="margin-top:24px;text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
                  style="display:inline-block;background:linear-gradient(90deg,#059669,#14b8a6);color:white;font-size:15px;font-weight:600;padding:10px 20px;border-radius:9999px;text-decoration:none;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                  Settle Payments
                </a>
              </div>

              <p style="margin-top:24px;font-size:14px;color:#6b7280;">
                Please settle them at your earliest convenience.  
                <br/><br/>
                Regards, <br/>
                <strong>SmartSplit Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align:center;margin-top:16px;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} SmartSplit. All rights reserved.
            </div>
          </div>
          `;
          try {
            await convex.action(api.emails.sendEmail, {
              to: u.email,
              subject: "You have pending payments on SmartSplit",
              html,
            });
            return { userId: u._id, success: true };
          } catch (err) {
            return { userId: u._id, success: false, error: err.message };
          }
        })
      );
    });

    return {
      processed: results.length,
      successes: results.filter((r) => r.success).length,
      failures: results.filter((r) => r.success === false).length,
    };
  }
);