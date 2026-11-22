import { z } from "zod";

export const deleteDepartmentSchema = z.object({
  operationType: z.literal("DELETE"),
  department_id: z.uuid(),
});

export type DeleteDepartmentInput = z.infer<typeof deleteDepartmentSchema>;
