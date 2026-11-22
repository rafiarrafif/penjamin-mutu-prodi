import { z } from "zod";

export const getSpecificDepartmentSchema = z.object({
  operationType: z.literal("READ"),
  department_id: z.uuid(),
});

export type GetSpecificDepartmentInput = z.infer<
  typeof getSpecificDepartmentSchema
>;
