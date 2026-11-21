import { z } from "zod";

export const deleteDataCategorySchema = z.object({
  operationType: z.literal("DELETE"),
  category_id: z.string().min(1),
});

export type DeleteDataCategoryInput = z.infer<typeof deleteDataCategorySchema>;
