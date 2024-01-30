import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { expenses } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { type PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { type DBSchema } from "@/server/db";
import { getPreviousMonthYear } from "@/utils/days";

const getTotalOfTheMonth = async (db: PlanetScaleDatabase<DBSchema>, userId: string, month: number, year: number) => {
  const results = await db
    .select({
      total: sql<number>`coalesce(sum(${expenses.amount}),0)`,
      totalPaid: sql<number>`coalesce(sum(case when ${expenses.isPaid} = true then ${expenses.amount} else 0 end),0)`,
      totalNotPaid: sql<number>`coalesce(sum(case when ${expenses.isPaid} = true then 0 else ${expenses.amount} end),0)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.createdById, userId),
        eq(expenses.monthYear, `${month}/${year}`)
      )
    )
  return results[0];
}

export const dashboardRouter = createTRPCRouter({
  total: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() })
      .transform((input) => ({ ...input, monthYear: `${input.month}/${input.year}` })))
    .query(async ({ ctx, input }) => {

      const currentMonth = await getTotalOfTheMonth(ctx.db, ctx.session.user.id, input.month, input.year);

      const previous = getPreviousMonthYear(input.month, input.year);

      const previousMonth = await getTotalOfTheMonth(ctx.db, ctx.session.user.id, previous.month, previous.year);

      const totalCurrentMonth = currentMonth?.total ?? 0;
      const totalPreviousMonth = previousMonth?.total ?? 0;

      const diff = totalCurrentMonth - totalPreviousMonth
      const percentage = totalPreviousMonth === 0 ? 0 : (diff / totalPreviousMonth) * 100

      return {
        currentMonth,
        previousMonth,
        percentageOverLastMonth: percentage,
      }
    })
})