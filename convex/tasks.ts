//new api endpoit used for all the queries of multiple tasks

import { v } from "convex/values";


import { query } from "./_generated/server";


export const get = query({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .order("desc")
            .collect();

            return tasks;
    },
});