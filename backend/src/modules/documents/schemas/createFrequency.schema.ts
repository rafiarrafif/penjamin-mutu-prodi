import { z } from "zod";

export const createFrequencySchema = z.object({
  operationType: z.literal("CREATE"),
  code: z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/)
    .max(32),
  label: z.string().min(1).max(225),
});

export type CreateFrequencyInput = z.infer<typeof createFrequencySchema>;
