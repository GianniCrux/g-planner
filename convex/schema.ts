import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    tasks: defineTable({
        title: v.string(),
        description: v.string(),
        orgId: v.string(),
        
    })
        .index("by_org", ["orgId"]) //defining the index (by_org) for faster query and define the field to be "orgId"

        .searchIndex("search_title", {
            searchField: "title",
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