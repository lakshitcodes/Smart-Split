import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getExpensesBetweenUsers = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const me = await ctx.runQuery(internal.users.getCurrentUser);

        if (me._id === userId) {
            throw new Error("Cannot query yourself");
        }

        /* 1. 1 on 1  expenses where either of the one is the payer*/
        const myPaid = await ctx.db
            .query("expenses")
            .withIndex("by_user_and_group", (q) =>
                q.eq("paidByUserId", me._id).eq("groupId", undefined)
            ).collect();

        const theirPaid = await ctx.db
            .query("expenses")
            .withIndex("by_user_and_group", (q) =>
                q.eq("paidByUserId", userId).eq("groupId", undefined)
            ).collect();


        const candidateExpense = [...myPaid, ...theirPaid];


        /* 2. Keep only those where these two users are involved */
        const expenses = candidateExpense.filter((expense) => {
            const meInSplits = expense.splits.some((s) => s.userId === me._id);
            const theirInSplits = expense.splits.some((s) => s.userId === userId);

            const meInvolved = expense.paidByUserId === me._id || meInSplits;
            const themInvolved = expense.paidByUserId === userId || theirInSplits;

            return meInvolved && themInvolved;
        });

        expenses.sort((a, b) => b.date - a.date);


        /* 3. Settlements between the two of us (groupId = undefined)*/
        const settlements = await ctx.db
            .query("settlements")
            .filter((q) =>
                q.and(
                    q.eq(q.field("groupId"), undefined),
                    q.or(
                        q.and(
                            q.eq(q.field("paidByUserId"), me._id),
                            q.eq(q.field("receivedByUserId"), userId)
                        ),
                        q.and(
                            q.eq(q.field("paidByUserId"), userId),
                            q.eq(q.field("receivedByUserId"), me._id)
                        ),
                    )
                )
            )
            .collect();

        settlements.sort((a, b) => b.date - a.date);


        /* 4. Compute running balances */
        let balance = 0;
        for (const e of expenses) {
            if (e.paidByUserId === me._id) {
                const split = e.splits.find((s) => s.userId === userId && !s.paid);
                if (split) {
                    balance += split.amount;    // they owe me 
                }
            } else {
                const split = e.splits.find((s) => s.userId === me._id && !s.paid);
                if (split) {
                    balance -= split.amount;    // I owe them
                }
            }
        }
        for (const s of settlements) {
            if (s.paidByUserId === me._id) {
                balance += s.amount; // i paid them
            } else {
                balance -= s.amount; // they paid me
            }
        }

        /* 5. Return payload */
        const other = await ctx.db.get(userId);
        if (!other) throw new Error("User not found");

        return {
            expenses,
            settlements,
            otherUser: {
                id: other._id,
                name: other.name,
                email: other.email,
                imageUrl: other.imageUrl,
            },
            balance,
        };

    },
})