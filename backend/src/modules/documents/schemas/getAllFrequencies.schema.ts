import { z } from "zod";

export const getAllFrequenciesSchema = z.object({
  operationType: z.literal("READ"),
});

export type GetAllFrequenciesInput = z.infer<typeof getAllFrequenciesSchema>;
