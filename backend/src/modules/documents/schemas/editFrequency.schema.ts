import { z } from "zod";

export const editFrequencySchema = z.object({
  operationType: z.literal("UPDATE"),
  code: z.string().min(1).max(32),
  label: z.string().min(1).max(225),
});

export type EditFrequencyInput = z.infer<typeof editFrequencySchema>;
