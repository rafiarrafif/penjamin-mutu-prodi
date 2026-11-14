import { z } from "zod";

export const deleteFromAdminSchema = z.object({
  operationType: z.literal("DELETE"),
  email: z.string().email().max(255),
});

export type DeleteFromAdminInput = z.infer<typeof deleteFromAdminSchema>;
