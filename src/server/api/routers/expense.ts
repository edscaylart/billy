import { z } from "zod";
import { asc, eq, inArray } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { expenses } from "@/server/db/schema";

export const expenseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(expenses);
  }),
});
