import { z } from "zod";

export const deleteFrequencySchema = z.object({
  operationType: z.literal("DELETE"),
  code: z.string().min(1).max(32),
});

export type DeleteFrequencyInput = z.infer<typeof deleteFrequencySchema>;
