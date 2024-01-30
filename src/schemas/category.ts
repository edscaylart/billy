import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const categorySchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string(),
})

export type TCategory = z.infer<typeof categorySchema>
