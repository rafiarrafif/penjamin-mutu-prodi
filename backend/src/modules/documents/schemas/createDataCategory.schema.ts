import { z } from "zod";

export const createDataCategorySchema = z.object({
  operationType: z.literal("CREATE"),
  name: z.string().max(250),
});

export type CreateDataCategoryInput = z.infer<typeof createDataCategorySchema>;
