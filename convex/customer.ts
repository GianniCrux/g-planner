import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        orgId: v.string(),
        name: v.string(),
        phoneNumber: v.string(),
        address: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const customer = await ctx.db.insert("customers", {
            orgId: args.orgId,
            name: args.name,
            phoneNumber: args.phoneNumber,
            address: args.address,
        });

        return customer;
    },
});

export const get = query({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const customers = await ctx.db
            .query("customers")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .order("desc")
            .collect();

        return customers;
    },
});

export const update = mutation({
    args: {
        id: v.id("customers"),
        name: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        address: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { id, ...updateData } = args;
        const customer = await ctx.db.patch(id, updateData);

        return customer;
    },
});

export const remove = mutation({
    args: { id: v.id("customers") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});