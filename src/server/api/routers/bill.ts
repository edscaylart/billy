import { z } from "zod";
import { asc, eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { bills, categories } from "@/server/db/schema";

export const billRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: bills.id,
        name: bills.name,
        dueDay: bills.dueDay,
        amount: bills.amount,
        categoryId: bills.categoryId,
        categoryName: categories.name
      })
      .from(bills)
      .leftJoin(categories, eq(categories.id, bills.categoryId))
      .orderBy(asc(bills.dueDay), asc(bills.name));
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.bills.findFirst({
        columns: {
          id: true,
          name: true,
          dueDay: true,
          amount: true,
          categoryId: true,
        },
        where: eq(bills.id, input.id),
      })
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      categoryId: z.string(),
      dueDay: z.number(),
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(bills).values({
        name: input.name,
        categoryId: input.categoryId,
        dueDay: input.dueDay,
        amount: input.amount,
        createdById: ctx.session.user.id,
      })
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      categoryId: z.string(),
      dueDay: z.number(),
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(bills).set({
        name: input.name,
        categoryId: input.categoryId,
        dueDay: input.dueDay,
        amount: input.amount,
        createdById: ctx.session.user.id,
      }).where(eq(bills.id, input.id));
    }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),
});
