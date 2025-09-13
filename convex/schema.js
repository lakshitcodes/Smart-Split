import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users
    users: defineTable({
        name: v.string(),
        username: v.optional(v.string()),
        email: v.string(),
        tokenIdentifier: v.string(),
        imageUrl: v.optional(v.string()),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"])
        .searchIndex("search_name", { searchField: "name" })
        .searchIndex("search_email", { searchField: "email" }),

    // Expenses
    expenses: defineTable({
        description: v.string(),
        amount: v.number(),
        category: v.optional(v.string()),
        date: v.number(), // timestamp
        paidByUserId: v.id("users"), // references to user table
        splitType: v.string(), //"equal", "percentage", "exact"
        splits: v.array(
            v.object({
                userId: v.id("users"), // references user table
                amount: v.number(),
                paid: v.boolean(),
            })
        ),
        groupId: v.optional(v.id("groups")), // references to group table
        createdBy: v.id("users"),
    })
        .index("by_group", ["groupId"])
        .index("by_user_and_group", ["paidByUserId", "groupId"])
        .index("by_date", ["date"]),

    // Groups
    groups: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        createdBy: v.id("users"),
        members: v.array(
            v.object({
                userId: v.id("users"), // references to user table
                role: v.string(),       //"admin" or "member"
                joinedAt: v.number(),    // timestamp
            })
        )
    })
        .index("by_created_by", ["createdBy"]),


    // Settlements
    settlements: defineTable({
        amount: v.number(),
        note: v.optional(v.string()),
        date: v.number(), // timestamp
        paidByUserId: v.id("users"), // Reference to users table
        receivedByUserId: v.id("users"), // Reference to users table
        groupId: v.optional(v.id("groups")), // null for one-on-one settlements
        relatedExpenseIds: v.optional(v.array(v.id("expenses"))), // Which expenses this settlement covers
        createdBy: v.id("users"), // Reference to users table
    })
        .index("by_group", ["groupId"])
        .index("by_user_and_group", ["paidByUserId", "groupId"])
        .index("by_receiver_and_group", ["receivedByUserId", "groupId"])
        .index("by_date", ["date"]),

});
