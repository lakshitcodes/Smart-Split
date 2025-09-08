import { formatCurrency } from "./formatCurrency";

function generateExpenseEmail({ type, creator, group, expense }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SmartSplit Expense Notification</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">

  <!-- Header -->
  <div style="background:linear-gradient(90deg,#059669,#14b8a6);padding:24px;text-align:center;">
    <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;">New Expense Notification 💸</h1>
    <p style="margin-top:8px;font-size:15px;color:#d1fae5;">${type === 'group' ? 'A new expense has been added to your group' : 'A new expense has been added with you by ' + creator.name}</p>
  </div>

  <!-- Container -->
  <div style="max-width:640px;margin:32px auto;padding:24px;background:#ffffff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">

    <!-- Expense Details -->
    <h2 style="font-size:20px;font-weight:700;color:#059669;margin-bottom:12px;">Expense Details</h2>
    <p style="margin-bottom:16px;line-height:1.6;color:#374151;"><strong>Description:</strong> ${expense.description}</p>
    <p style="margin-bottom:16px;line-height:1.6;color:#374151;"><strong>Amount:</strong> ${formatCurrency(expense.amount)}</p>
    <p style="margin-bottom:16px;line-height:1.6;color:#374151;"><strong>Category:</strong> ${expense.category}</p>
    <p style="margin-bottom:16px;line-height:1.6;color:#374151;"><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>

    <!-- CTA -->
    <div style="text-align:center;margin-top:24px;">
      <a href="https://smart-split-lakshit.vercel.app/" style="display:inline-block;padding:12px 24px;background:linear-gradient(90deg,#059669,#14b8a6);color:#fff;font-weight:600;text-decoration:none;border-radius:9999px;">
        View Expense & Settle Up
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;margin:24px 0;font-size:13px;color:#6b7280; padding-bottom:24px">
    © 2025 SmartSplit · All rights reserved
  </div>

</body>
</html>
`;
}

export { generateExpenseEmail };
