import { z } from "zod";

export const createNewDepartmentSchema = z.object({
  operationType: z.literal("CREATE"),
  name: z.string().max(115),
  description: z.string().max(255).optional(),
});

export type CreateNewDepartmentInput = z.infer<
  typeof createNewDepartmentSchema
>;
