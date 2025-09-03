import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const getAllContacts = query({

    handler: async (ctx) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser)

        // Expenses paid by the user
        const expensesYouPaid = await ctx.db.query("expenses").withIndex("by_user_and_group", (q) => {
            q.eq("userId", currentUser._id).eq("groupId", undefined);
        })
            .collect()

        // Expenses not paid by the user
        const expensesNotPaidByYou = (await ctx.db.query("expenses").withIndex("by_group", (q) => {
            q.eq("groupId", undefined);
        })
            .collect())
            .filter(
                (e) => e.paidByUserId !== currentUser._id &&
                    e.splits.some((s) => s.userId === currentUser._id)
            );


        // All the expenses the current user is a part of
        const personalExpenses = [...expensesYouPaid, ...expensesNotPaidByYou];

        // The contacts that are associated in those expenses
        const contactIds = new Set();
        personalExpenses.forEach((exp) => {
            if (exp.paidByUserId !== currentUser._id) {
                contactIds.add(exp.paidByUserId);
            }
            // Add each user in the splits that isnt the current user
            exp.splits.forEach((split) => {
                if (split.userId !== currentUser._id) {
                    contactIds.add(split.userId);
                }
            });
        });

        // Getting the user information of those contacts
        const contactUsers = await Promise.all(
            [...contactIds].map(async (id) => {
                const u = await ctx.db.get(id);

                return u ? {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    imageUrl: u.imageUrl,
                    type: "user",  // add a type marker to distinguish from groups
                } : null;
            })
        )


        // Get all the user groups in which the currentUser is a part of
        const userGroups = (await ctx.db.query("groups").collect()).filter((g) => {
            g.members
                .some((m) => m.userId === currentUser._id)
                .map((g) => ({
                    g: g._id,
                    name: g.name,
                    description: g.description,
                    memberCount: g.members.length,
                    type: "group",
                }))
        });

        // Sorting results alphabetically
        contactUsers.sort((a, b) => a?.name.localeCompare(b?.name))
        userGroups.sort((a, b) => a?.name.localeCompare(b?.name))


        // Returning the combined results
        return {
            users: contactUsers.filter(Boolean),
            groups: userGroups,
        }
    }
})


export const createGroup = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        members: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser)

        if (!args.name.trim()) {
            throw new Error("Group name cannot be empty");
        }

        const uniqueMembers = new Set(args.members);

        uniqueMembers.add(currentUser._id);

        for (const id of uniqueMembers) {
            if (! await ctx.db.get(id)) {
                throw new Error(`User with ID ${id} does not exist`);
            }
        }

        return await ctx.db.insert("groups", {
            name: args.name.trim(),
            description: args.description?.trim() ?? "",
            createdBy: currentUser._id,
            members: [...uniqueMembers].map((id) => ({
                userId: id,
                role: id === currentUser._id ? "admin" : "member",
                joinedAt: Date.now(),
            })),
        })

    }
})