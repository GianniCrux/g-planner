//creating our api endpoint.

import { v } from "convex/values";

import { mutation } from "./_generated/server";

/* 
export const create = mutation({
    args: { 
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

export const create = mutation({//passing the arguments which we expect a task must has before being created
    
    args: {
        orgId: v.string(),
        title: v.string(),
        description: v.string(),
        assignedTo: v.optional(v.string()),
        assignedToName: v.optional(v.string()),
        date: v.optional(v.string()),
        type: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {//has access to the context and the orguments from above
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const tasks = await ctx.db.insert("tasks", { 
            orgId: args.orgId,
            title: args.title,
            description: args.description,
            authorId: identity.subject,
            authorName: identity.name!,
            assignedTo: args.assignedTo,
            assignedToName: args.assignedToName,
            date: args.date,
            type: args.type,
            startTime: args.startTime,
            endTime: args.endTime,
         })
            

        return tasks;
    },
});

export const remove = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        //TODO:: check to delet personal relation as well after adding it

        await ctx.db.delete(args.id);
    },
});


export const update = mutation({
    args: { 
        id: v.id("tasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        assignedTo: v.optional(v.string()),
        assignedToName: v.optional(v.string()),
        date: v.optional(v.string()),
        type: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if (!identity) {
          throw new Error("Unauthorized");
        }
        
        const task = await ctx.db.patch(args.id, {
            title: args.title,
            description: args.description,
            assignedTo: args.assignedTo,
            assignedToName: args.assignedToName,
            date: args.date,
            type: args.type,
            startTime: args.startTime,
            endTime: args.endTime
        });
      
          return task;
    },
})

export const toggleTaskCompletion = mutation({
    args: { taskId: v.id("tasks"), isCompleted: v.boolean() },
    handler: async (ctx, args) => {
        const { taskId, isCompleted } = args;
        await ctx.db.patch(taskId, { isCompleted });
    },
});