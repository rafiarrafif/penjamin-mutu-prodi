import { z } from "zod";

export const getCurrentSessionSchema = z.object({
  operationType: z.literal("READ"),
});

export type GetCurrentSessionInput = z.infer<typeof getCurrentSessionSchema>;
