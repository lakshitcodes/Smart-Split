import { internal } from "./_generated/api";
import { query } from "./_generated/server";

// Get user balances
export const getUserBalances = query({
    handler: async (ctx) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        /* ───────────── 1‑to‑1 expenses (no groupId) ───────────── */
        // Filter expenses to only include one to one expenses(not group expenses)
        // where the current user is either the payer or in the splits

        // Case 1: expenses paid by current user
        const expensesPaid = await ctx.db
            .query("expenses")
            .withIndex("by_user_and_group", (q) =>
                q.eq("paidByUserId", currentUser._id).eq("groupId", null)
            )
            .collect();

        // Case 2: expenses where user is in splits (needs filtering in JS)
        const expensesSplits = await ctx.db
            .query("expenses")
            .withIndex("by_group", (q) => q.eq("groupId", null)) // only 1-to-1
            .collect();

        const expenses = [
            ...expensesPaid,
            ...expensesSplits.filter((e) =>
                e.splits.some((s) => s.userId === currentUser._id)
            ),
        ];

        let youOwe = 0; // total amount user owe others
        let youAreOwed = 0; // Total amount others owe the user
        const balanceByUser = {}; // Detailed breakdown per user

        //Process each expense to calculate balances
        for (const e of expenses) {
            const isPayer = e.paidByUserId === currentUser._id;
            const mySplit = e.splits.find((s) => s.userId === currentUser._id);

            if (isPayer) {
                for (const s of e.splits) {
                    // Skip user's splits or users own splits
                    if (s.paid || s.userId === currentUser._id) continue;

                    // Calculate the amount owed based on the split
                    youAreOwed += s.amount;
                    (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
                }
            } else if (mySplit && !mySplit.paid) {
                // Someone else paid and user hasnt paid their splits
                youOwe += mySplit.amount;
                (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owing +=
                    mySplit.amount;
            }
        }

        /* ───────────── 1‑to‑1 expenses (no groupId) ───────────── */
        // Get settlements that direclty involve the current user
        const settlementsPaid = await ctx.db
            .query("settlements")
            .withIndex("by_user_and_group", (q) =>
                q.eq("paidByUserId", currentUser._id).eq("groupId", null)
            )
            .collect();

        const settlementsReceived = await ctx.db
            .query("settlements")
            .withIndex("by_receiver_and_group", (q) =>
                q.eq("receivedByUserId", currentUser._id).eq("groupId", null)
            )
            .collect();

        // User paid someone else -> reduces at user owes
        for (const s of settlementsPaid) {
            youOwe -= s.amount;
            (balanceByUser[s.receivedByUserId] ??= { owed: 0, owing: 0 }).owing -=
                s.amount;
        }

        // Someone paid the user -> reduces what they owe the user
        for (const s of settlementsReceived) {
            youAreOwed -= s.amount;
            (balanceByUser[s.paidByUserId] ??= { owed: 0, owing: 0 }).owed -=
                s.amount;
        }

        /* build lists for UI */
        const youOweList = []; // List of people user owes money to
        const youAreOwedByList = []; // List of people who owe the user

        for (const [uid, { owed, owing }] of Object.entries(balanceByUser)) {
            const net = owed - owing;
            if (net === 0) {
                continue;
            }
            // Get user details
            const counterpart = await ctx.db.get(uid);
            const base = {
                userId: uid,
                name: counterpart?.name ?? "unknown",
                imageUrl: counterpart?.imageUrl,
                amount: Math.abs(net),
            };

            if (net > 0) {
                youAreOwedByList.push(base);
            } else {
                youOweList.push(base);
            }
        }

        youOweList.sort((a, b) => b.amount - a.amount);
        youAreOwedByList.sort((a, b) => b.amount - a.amount);

        return {
            youOwe, // total amount user owes
            youAreOwed, // total amount user is owed
            totalBalance: youAreOwed - youOwe, // Net balance
            oweDetails: { youOwe: youOweList, youAreOwedBy: youAreOwedByList }, // Detailed breakdown
        };
    },
});

export const getTotalSpent = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).getTime();

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_date", (q) => q.gte("date", startOfYear))
            .collect();

        // Filter those expenses in which user is involved
        const userExpenses = expenses.filter(
            (expense) =>
                expense.paidByUserId === user._id ||
                expense.splits.some((split) => split.userId === user._id)
        );

        let totalSpent = 0;
        userExpenses.forEach((expense) => {
            const userSplit = expense.splits.find(
                (split) => split.userId === user._id
            );

            if (userSplit) {
                totalSpent += userSplit.amount;
            }
        });

        return totalSpent;
    },
});

export const getMonthlySpending = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        // Get current year and its start timestamp
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).getTime();

        // Get all expenses for current year
        const allExpenses = await ctx.db
            .query("expenses")
            .withIndex("by_date", (q) => q.gte("date", startOfYear))
            .collect();
        const userExpenses = allExpenses.filter(
            (expense) =>
                expense.paidByUserId === user._id ||
                expense.splits.some((split) => split.userId === user._id)
        );

        const monthlyTotals = {};
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(currentYear, i, 1);
            monthlyTotals[monthDate.getTime()] = 0;
        }

        userExpenses.forEach((expense) => {
            const date = new Date(expense.date);

            const monthStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            ).getTime();

            const userSplit = expense.splits.find(
                (split) => split.userId === user._id
            );

            if (userSplit) {
                monthlyTotals[monthStart] =
                    (monthlyTotals[monthStart] || 0) + userSplit.amount;
            }
        });

        const result = Object.entries(monthlyTotals).map(([month, total]) => ({
            month: parseInt(month),
            total,
        }));

        // Sort by month (chronological order)
        result.sort((a, b) => a.month - b.month);

        return result;
    },
});

export const getUserGroups = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const allGroups = await ctx.db.query("groups").collect();
        const groups = allGroups.filter((group) => {
            group.members.some((member) => member.userId === user._id)
        })

        const enhancedGroups = await Promise.all(
            groups.map(async (group) => {
                // get all expenses for this specific group
                const totalSpent = await ctx.db
                    .query("expenses")
                    .withIndex("by_group", (q) => q.eq("groupId", group._id))
                    .collect();

                let balance = 0;

                // Calculate balance from expenses
                expenses.forEach((expense) => {
                    if (expense.paidByUserId === user._id) {
                        // User paid the expense , others may owe them
                        expense.splits.forEach((split) => {
                            // Add amounts others owe to the user (excluding user's own split and paid splits)
                            if (split.userId !== user._id && !split.paid) {
                                balance += split.amount;
                            }
                        });
                    } else {
                        // Someone else paid the expense , user may owe them
                        const userSplit = expense.splits.find(
                            (split) => split.userId === user._id
                        );
                        // Subtract the amount user owes others
                        if (userSplit && !userSplit.paid) {
                            balance -= userSplit.amount;
                        }
                    }
                });

                // Apply settlements to adjust the balance
                const settlements = await ctx.db
                    .query("settlements")
                    .filter((q) =>
                        q.and(
                            q.eq(q.field("groupId"), group._id),
                            q.or(
                                q.eq(q.field("paidByUserId"), user._id),
                                q.eq(q.field("receivedByUserId"), user._id)
                            )
                        )).collect();


                settlements.forEach((settlement) => {
                    if (settlement.paidByUserId === user._id) {
                        // User paid someone in the group - increases user's balance
                        balance += settlement.amount;
                    } else {
                        // Someone paid the user - decreases user's balance
                        balance -= settlement.amount;
                    }
                });

                return {
                    ...group,
                    id: group._id,
                    balance,
                };
            })
        );

        return enhancedGroups;
    },
});