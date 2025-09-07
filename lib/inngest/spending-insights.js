import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inngest } from "./client";
import { formatCurrency } from "../formatCurrency";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const spendingInsights = inngest.createFunction(
    { name: "Generate Spending Insights", id: "generate-spending-insights" },
    { cron: "0 8 1 * *" }, // monthly on the 1st at 8 AM UTC
    async ({ step }) => {
        /** -----------------1. Pull users with expenses this month----------------------- */
        const users = await step.run("Fetch users with expenses", async () => {
            return await convex.query(api.inngest.getUsersWithExpenses);
        })


        /** -----------------2. Iterate users and send insight email----------------------- */
        const results = [];
        for (const user of users) {
            /* a. Pull last-month expenses (skip if none) */
            const expenses = await step.run(`Expenses · ${user._id}`, () =>
                convex.query(api.inngest.getUserMonthlyExpenses, { userId: user._id })
            );
            if (!expenses?.length) continue;

            /* b. Build JSON blob for the prompt */
            const expenseData = JSON.stringify({
                expenses,
                totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
                categories: expenses.reduce((cats, e) => {
                    cats[e.category ?? "uncategorised"] =
                        (cats[e.category] ?? 0) + e.amount;
                    return cats;
                }, {}),
            });

            /* c. Prompt + AI call using step.ai.wrap (retry-aware) */
            const html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>SmartSplit Insights</title>
                </head>
                <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
                    <!-- Header -->
                    <div style="background:linear-gradient(90deg,#059669,#14b8a6);padding:24px;text-align:center;">
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;">
                        SmartSplit Monthly Insights
                    </h1>
                    <p style="margin-top:8px;font-size:15px;color:#d1fae5;">
                        A snapshot of your spending & savings opportunities
                    </p>
                    </div>

                    <!-- Container -->
                    <div style="max-width:640px;margin:32px auto;padding:24px;background:#ffffff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    
                    <!-- Section Template -->
                    <h2 style="font-size:20px;font-weight:700;color:#059669;margin-bottom:12px;">[Section Title]</h2>
                    <p style="margin-bottom:16px;line-height:1.6;color:#374151;">[Section content goes here]</p>

                    <!-- Example Table -->
                    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
                        <thead>
                        <tr style="background:#f3f4f6;color:#374151;text-align:left;">
                            <th style="padding:8px;">Category</th>
                            <th style="padding:8px;">Amount</th>
                            <th style="padding:8px;">% of Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style="border-bottom:1px solid #e5e7eb;">
                            <td style="padding:8px;">Food</td>
                            <td style="padding:8px;">₹12,000</td>
                            <td style="padding:8px;">30%</td>
                        </tr>
                        <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb;">
                            <td style="padding:8px;">Transport</td>
                            <td style="padding:8px;">₹5,500</td>
                            <td style="padding:8px;">14%</td>
                        </tr>
                        </tbody>
                    </table>

                    <!-- Gradient CTA -->
                    <div style="text-align:center;margin-top:24px;">
                        <a href="https://smart-split-jade.vercel.app/" style="display:inline-block;padding:12px 24px;background:linear-gradient(90deg,#059669,#14b8a6);color:#fff;font-weight:600;text-decoration:none;border-radius:9999px;">
                        View Detailed Report
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
            const prompt = `
                As a financial analyst, review this user's spending data for the past month and provide insightful observations and suggestions.
                Focus on spending patterns, category breakdowns, and actionable advice for better financial management.
                Use a friendly, encouraging tone. Format your response in HTML for an email and use the ((${html})) code for styling and as a skeleton , add sections and other things if needed.
                Also dont add "\`\`\`html" or "\`\`\`" in the response, just the pure HTML.

                Anything you say , dont mention I have , always use We have as you talking on behalf of the app and its team.
                User spending data:
                ${expenseData}

                Structure your response using these sections:

                1. Monthly Overview
                - Total spent, number of transactions, average per transaction
                - Days with the highest and lowest spending

                2. Top Spending Categories
                - Breakdown by category with percentages and total amounts
                - Use table or list for clarity

                3. Unusual Spending Patterns
                - Identify large one-off expenses or new categories
                - Note spikes or inconsistencies

                4. Saving Opportunities
                - Based on spending data, suggest realistic areas to cut back
                - Include peer comparisons if possible

                5. Category-Specific Tips
                - Offer practical advice tailored to high-spend areas

                6. Recommendations for Next Month
                - Suggest category limits, budgeting tools, or financial challenges

                Keep the tone supportive and user-friendly.
                `.trim();


            try {
                const aiResponse = await step.ai.wrap(
                    "gemini",
                    async (p) => model.generateContent(p),
                    prompt
                );

                const htmlBody =
                    aiResponse.response.candidates[0]?.content.parts[0]?.text ?? "";

                /* d. Send the email */
                await step.run(`Email · ${user._id}`, () =>
                    convex.action(api.emails.sendEmail, {
                        to: user.email,
                        subject: "Your SmartSplit Monthly Spending Insights",
                        html: htmlBody,
                    }));

                results.push({ userId: user._id, success: true });
            } catch (err) {
                results.push({
                    userId: user._id,
                    success: false,
                    error: err.message,
                });
            }
        }

        /* ─── 3. Summary for the cron log ───────────────────────────────── */
        return {
            processed: results.length,
            success: results.filter((r) => r.success).length,
            failed: results.filter((r) => !r.success).length,
        };
    }
);