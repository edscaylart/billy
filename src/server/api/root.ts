import { postRouter } from "@/server/api/routers/post";
import { categoryRouter } from "@/server/api/routers/category";
import { billRouter } from "@/server/api/routers/bill";
import { expenseRouter } from "@/server/api/routers/expense";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
  bill: billRouter,
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
