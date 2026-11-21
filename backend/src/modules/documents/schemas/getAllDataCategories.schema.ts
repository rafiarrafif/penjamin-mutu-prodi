import { z } from "zod";

export const getAllDataCategoriesSchema = z.object({
  operationType: z.literal("READ"),
});

export type GetAllDataCategoriesInput = z.infer<
  typeof getAllDataCategoriesSchema
>;
