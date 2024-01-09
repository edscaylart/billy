import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
  id: z.string(),
  name: z.string(),
  billId: z.string().nullable(),
  dueDay: z.number().nullable(),
  monthYear: z.string(),
  amount: z.number(),
  isPaid: z.boolean(),
  categoryId: z.string(),
  categoryName: z.string().nullable().optional(),
})

export type TExpense = z.infer<typeof expenseSchema>
