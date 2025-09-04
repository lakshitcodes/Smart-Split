import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getGroupExpenses = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        const group = await ctx.db.get(groupId);
        if (!group) throw new Error("Group not found");


        if (!group.members.some((m) => m.userId === currentUser._id)) {
            throw new Error("You are not a member of this group");
        }

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_group", (q) => q.eq("groupId", groupId))
            .collect();

        const settlements = await ctx.db
            .query("settlements")
            .withIndex("by_group", (q) => q.eq("groupId", groupId))
            .collect();

        /** ----------------member map-------------------- */
        const memberDetails = await Promise.all(
            group.members.map(async (m) => {
                const u = await ctx.db.get(m.userId);
                return {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    imageUrl: u.imageUrl,
                };
            })
        );

        const ids = memberDetails.map((m) => m.id);


        // Balance calculation step
        // --------------------------------------
        // Initialize totals object to track overall balance for each user
        // Format : {userId1: balance1 , userId2 : balance2 ....}

        const totals = Object.fromEntries(ids.map((id) => [id, 0]));

        // Create a 2D ledger to track who owes whom
        // ledger[A][B] = how much A owes B
        const ledger = {};

        ids.forEach((a) => {
            ledger[a] = {};
            ids.forEach((b) => {
                if (a != b) {
                    ledger[a][b] = 0;
                }
            })
        })


        // Apply expenses to balance
        for (const exp of expenses) {
            const payer = exp.paidByUserId;

            for (const split of exp.splits) {
                if (split.userId === payer || split.paid) continue;

                const debtor = split.userId;
                const amt = split.amount;

                // Update totals : increase payer's balance , decrease debtor's balance
                totals[payer] += amt;   // Payer gains credit
                totals[debtor] -= amt;  // Debtor goes into debt

                // Update ledger
                ledger[debtor][payer] += amt;
            }
        }

        // Apply settlements to balance
        for (const s of settlements) {
            totals[s.paidByUserId] += s.amount;
            totals[s.receivedByUserId] -= s.amount;

            // Update ledger : reduce what payer owes receiver
            ledger[s.paidByUserId][s.receivedByUserId] -= s.amount;
        }


        // Format response data
        // --------------------------------
        // Create a comprehensive balance object for each member
        const balances = memberDetails.map(m => ({
            ...m,
            totalBalance: totals[m.id],
            owes: Object.entries(ledger[m.id])
                .filter(([_, v]) => v > 0)
                .map(([to, amount]) => { to, amount }),
            owedBy: ids
                // ledger[A][B] = A ko B k kitne paise dene h 
                .filter((other) => ledger[other][m.id] > 0)
                .map((other) => ({ from: other, amount: ledger[other][m.id] })),

        }));


        const userLookupMap = {};
        memberDetails.forEach((member) => {
            userLookupMap[member.id] = member;
        });


        // Returning all the information
        return {
            // Group Information
            group: {
                id: group._id,
                name: group.name,
                description: group.description,
            },
            members: memberDetails, // All group members with details
            expenses,       //All expenses in this group
            settlements,    // All settlements in this group
            balances,       // Calculated balance info for each member
            userLookupMap,  // Map for quick user detail access
        };
    },
})