import { z } from "zod";

export const getSpecificRequirementSchema = z.object({
  operationType: z.literal("READ"),
  requirement_id: z.string().uuid(),
});

export type GetSpecificRequirementInput = z.infer<
  typeof getSpecificRequirementSchema
>;
