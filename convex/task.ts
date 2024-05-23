//creating our api endpoint.

import { v } from "convex/values";

import { mutation } from "./_generated/server";

/* 
export const create = mutation({
    args: { //passing the arguments which we expect a task must has before being created
        orgId: v.string(),
        title: v.string(),
        description: v.string(),
        assignedTo: v.optional(v.string()),
        type: v.optional(v.string()),
        dueDate: v.optional(v.string()),
        customer: v.optional(v.string()),
    },
    handler: async (ctx, args) => { //has access to the context and the orguments from above
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const task = await ctx.db.insert("tasks", {
            title: args.title,
            description: args.description,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            customer: args.customer === "" ? undefined : args.customer,
            assignedTo: args.assignedTo === "" ? undefined : args.assignedTo,
            type: args.type === "" ? undefined : args.type,
            dueDate: args.dueDate,
        });

        return task;
    }  
}) */

export const create = mutation({
    
    args: {
        orgId: v.string(),
        title: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        console.log(args.title, "ciaone")

        const tasks = await ctx.db.insert("tasks", { 
            orgId: args.orgId,
            title: args.title,
            description: args.description,
         })
            

        return tasks;
    },
});
