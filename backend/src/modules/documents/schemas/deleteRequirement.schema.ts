import { z } from "zod";

export const deleteRequirementSchema = z.object({
  operationType: z.literal("DELETE"),
  requirement_id: z.string().uuid(),
});

export type DeleteRequirementInput = z.infer<typeof deleteRequirementSchema>;
