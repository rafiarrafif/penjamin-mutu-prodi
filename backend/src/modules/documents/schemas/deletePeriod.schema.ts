import { z } from "zod";

export const deletePeriodSchema = z.object({
  operationType: z.literal("DELETE"),
  period_id: z.string().uuid(),
});

export type DeletePeriodInput = z.infer<typeof deletePeriodSchema>;
