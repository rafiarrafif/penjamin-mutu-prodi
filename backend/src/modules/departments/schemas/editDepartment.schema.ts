import { z } from "zod";

export const editDepartmentSchema = z
  .object({
    operationType: z.literal("UPDATE"),
    department_id: z.uuid(),
    name: z.string().min(1).max(115).optional(),
    description: z.string().max(255).nullable().optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.description !== undefined,
    {
      message: "At least one field besides department_id must be provided.",
      path: ["name"],
    },
  );

export type EditDepartmentInput = z.infer<typeof editDepartmentSchema>;
