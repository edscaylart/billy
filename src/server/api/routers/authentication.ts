import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { registerSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const hashedPassword = await bcrypt.hash(password, 10);

      const exists = await ctx.db.query.users.findFirst({ where: eq(users.email, email) })

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      await ctx.db.insert(users).values({ email, name, password: hashedPassword })

      return {
        status: 201,
        message: "Account created successfully",
      };
    }),
});
