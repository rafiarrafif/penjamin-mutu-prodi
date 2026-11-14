import { z } from "zod";

export const revokeCurrentSchema = z.object({
  operationType: z.literal("UPDATE"),
});

export type RevokeCurrentInput = z.infer<typeof revokeCurrentSchema>;
