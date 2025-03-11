
import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { mutation, query } from "./_generated/server";



export const getProjects = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return await ctx.db
      .query("projects")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createProject = mutation({
  args: { orgId: v.string(), name: v.string() },
  handler: async (ctx, { orgId, name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const newProject = {
      orgId,
      name,
      createdAt: new Date().toISOString(),
    };
    const projectId = await ctx.db.insert("projects", newProject);
    return { _id: projectId, ...newProject };
  },
});