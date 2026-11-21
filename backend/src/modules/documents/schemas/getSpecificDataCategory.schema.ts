import { z } from "zod";

export const getSpecificDataCategorySchema = z.object({
  operationType: z.literal("READ"),
  id: z.string().min(1).max(255),
});

export type GetSpecificDataCategoryInput = z.infer<
  typeof getSpecificDataCategorySchema
>;
