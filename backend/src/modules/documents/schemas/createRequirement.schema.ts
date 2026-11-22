import { z } from "zod";

export const createRequirementSchema = z.object({
  operationType: z.literal("CREATE"),
  category_id: z.string().uuid(),
  frequency_code: z.string().min(1).max(32),
  name: z.string().min(1).max(500),
});

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
