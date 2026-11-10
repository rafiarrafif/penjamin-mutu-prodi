import { z } from "zod";

export const createDepartmentSchema = z.object({
  operationType: z.literal("CREATE"),
  name: z.string().max(115),
  description: z.string().max(255).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
