import { z } from "zod";
import { asc, eq, and } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { categories, expenses } from "@/server/db/schema";

export const expenseRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() }).transform((input) => ({ monthYear: `${input.month}/${input.year}` })))
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: expenses.id,
          name: expenses.name,
          billId: expenses.billId,
          dueDay: expenses.dueDay,
          monthYear: expenses.monthYear,
          amount: expenses.amount,
          isPaid: expenses.isPaid,
          categoryId: expenses.categoryId,
          categoryName: categories.name,
        })
        .from(expenses)
        .leftJoin(categories, eq(categories.id, expenses.categoryId))
        .where(and(eq(expenses.createdById, ctx.session.user.id), eq(expenses.monthYear, input.monthYear)))
        .orderBy(asc(expenses.isPaid), asc(expenses.dueDay), asc(expenses.name));
    }),

  markAsPaid: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(expenses).set({ isPaid: true }).where(eq(expenses.id, input.id));
    }),

  updateAmount: protectedProcedure
    .input(z.object({
      id: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(expenses).set({ amount: input.amount }).where(eq(expenses.id, input.id));
    }),
});