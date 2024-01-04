import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    })
  })
})