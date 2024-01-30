import { categoryRouter } from "@/server/api/routers/category";
import { billRouter } from "@/server/api/routers/bill";
import { expenseRouter } from "@/server/api/routers/expense";
import { createTRPCRouter } from "@/server/api/trpc";
import { dashboardRouter } from "./routers/dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  category: categoryRouter,
  bill: billRouter,
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
