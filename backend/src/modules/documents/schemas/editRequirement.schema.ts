import { z } from "zod";

export const editRequirementSchema = z
  .object({
    operationType: z.literal("UPDATE"),
    requirement_id: z.string().uuid(),
    category_id: z.string().uuid().optional(),
    frequency_code: z.string().min(1).max(32).optional(),
    name: z.string().min(1).max(500).optional(),
  })
  .refine(
    (value) =>
      value.category_id !== undefined ||
      value.frequency_code !== undefined ||
      value.name !== undefined,
    {
      message: "At least one field besides requirement_id must be provided",
      path: ["requirement_id"],
    },
  );

export type EditRequirementInput = z.infer<typeof editRequirementSchema>;
