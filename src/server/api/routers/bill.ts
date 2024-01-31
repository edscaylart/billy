import { z } from "zod";
import { and, asc, eq, inArray } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { bills, categories, expenses } from "@/server/db/schema";

export const billRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: bills.id,
        name: bills.name,
        dueDay: bills.dueDay,
        amount: bills.amount,
        categoryId: bills.categoryId,
        categoryName: categories.name,
      })
      .from(bills)
      .leftJoin(categories, eq(categories.id, bills.categoryId))
      .where(eq(bills.createdById, ctx.user.id))
      .orderBy(asc(bills.dueDay), asc(bills.name));
  }),

  byOne: protectedProcedure
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
        where: and(eq(bills.createdById, ctx.user.id), eq(bills.id, input.id)),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        categoryId: z.string(),
        dueDay: z.number(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(bills).values({
        name: input.name,
        categoryId: input.categoryId,
        dueDay: input.dueDay,
        amount: input.amount,
        createdById: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        categoryId: z.string(),
        dueDay: z.number(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bills)
        .set({
          name: input.name,
          categoryId: input.categoryId,
          dueDay: input.dueDay,
          amount: input.amount,
          createdById: ctx.user.id,
        })
        .where(eq(bills.id, input.id));
    }),

  generateExpenses: protectedProcedure
    .input(
      z
        .object({
          ids: z.array(z.string()),
          month: z.number(),
          year: z.number(),
        })
        .transform((input) => ({
          ids: input.ids,
          monthYear: `${input.month}/${input.year}`,
        })),
    )
    .mutation(async ({ ctx, input }) => {
      const selectedBills = await ctx.db.query.bills.findMany({
        where: inArray(bills.id, input.ids),
      });

      const expenseData = selectedBills.map((bill) => ({
        name: bill.name,
        categoryId: bill.categoryId,
        billId: bill.id,
        dueDay: bill.dueDay,
        monthYear: input.monthYear,
        amount: bill.amount,
        isPaid: false,
        createdById: ctx.user.id,
      }));

      await ctx.db.insert(expenses).values(expenseData);

      return { generated: true };
    }),

  updateAmounts: protectedProcedure
    .input(
      z
        .object({
          month: z.number(),
          year: z.number(),
        })
        .transform((input) => ({
          monthYear: `${input.month}/${input.year}`,
        })),
    )
    .mutation(async ({ ctx, input }) => {
      const expenseList = await ctx.db.query.expenses.findMany({
        where: and(
          eq(expenses.createdById, ctx.user.id),
          eq(expenses.monthYear, input.monthYear),
        ),
      });
      await ctx.db.transaction(async (tx) => {
        for (const expenseRow of expenseList) {
          if (expenseRow.billId) {
            await tx
              .update(bills)
              .set({
                amount: expenseRow.amount,
              })
              .where(eq(bills.id, expenseRow.billId));
          }
        }
      });
      return { generated: true };
    }),
});
