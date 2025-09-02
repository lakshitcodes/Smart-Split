import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        imageUrl: v.optional(v.string()),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"])
        .searchIndex("search_name", { searchField: "name" })
        .searchIndex("search_email", { searchField: "email" }),

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

    settlements: defineTable({
        amount: v.number(),
        note: v.optional(v.string()),
        date: v.number(),
        paidByUserId: v.id("users"),       // references to user table
        recievedByUserId: v.id("users"),   // references to user table
        groupId: v.optional(v.id("groups")),   //undefined for one-to-one settlements
        relatedExpenseId: v.optional(v.array(v.id("expenses"))), //which expense this settlement covers
        createdBy: v.id("users"),  // references to user table
    })
        .index("by_group", ["groupId"])
        .index("by_user_and_group", ["paidByUserId", "groupId"])
        .index("by_reciever_and_group", ["recievedByUserId", "groupId"])
        .index("by_date", ["date"]),
});
