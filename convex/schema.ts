import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    tasks: defineTable({
        title: v.string(),
        description: v.string(),
        orgId: v.string(),
        assignedTo: v.optional(v.string()),
        assignedToName: v.optional(v.string()),
        authorId: v.string(),
        authorName: v.string(),
        date: v.optional(v.string()),
        type: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        isCompleted: v.optional(v.boolean()),
        customerId: v.optional(v.id("customers")),
        priority: v.optional(v.string()),
    })
        .index("by_org", ["orgId"]) //defining the index (by_org) for faster query and define the field to be "orgId"

        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["orgId"]
        }),

    customers: defineTable({
        orgId: v.string(),
        name: v.string(),
        phoneNumber: v.string(),
        address: v.string(),
        lastOrderId: v.optional(v.id("tasks")),
    })
        .index("by_org", ["orgId"])
        .searchIndex("search_name", {
            searchField: "name",
            filterFields: ["orgId"]
        }),
});


/* authorId: v.string(),
        authorName: v.string(),
        customer: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        assignedTo: v.optional(v.string()),
        type: v.optional(v.string()),
        dueDate: v.optional(v.string()), 
        
                .index("by_employee", ["assignedTo"])
        .index("by_type", ["type"])
        */