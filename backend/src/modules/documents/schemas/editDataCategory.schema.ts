import { z } from "zod";

export const editDataCategorySchema = z.object({
  operationType: z.literal("UPDATE"),
  category_id: z.string().min(1),
  name: z.string().min(1).max(255),
});

export type EditDataCategoryInput = z.infer<typeof editDataCategorySchema>;
