import { z } from "zod";

export const getAllRequirementsSchema = z.object({
  operationType: z.literal("READ"),
  category_id: z.string().uuid().optional(),
  frequency_code: z.string().min(1).max(32).optional(),
});

export type GetAllRequirementsInput = z.infer<typeof getAllRequirementsSchema>;
