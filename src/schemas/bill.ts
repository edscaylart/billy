import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const billSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string(),
  dueDay: z.number(),
  amount: z.number(),
  categoryId: z.string(),
  categoryName: z.string().nullable().optional(),
})

export type TBill = z.infer<typeof billSchema>
