import { z } from "zod";

export const getAllPeriodsSchema = z.object({
  operationType: z.literal("READ"),
  frequency_code: z.string().min(1).max(32).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});

export type GetAllPeriodsInput = z.infer<typeof getAllPeriodsSchema>;
