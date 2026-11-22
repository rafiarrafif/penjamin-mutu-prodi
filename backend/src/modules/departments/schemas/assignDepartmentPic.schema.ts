import { z } from "zod";

export const assignDepartmentPicSchema = z.object({
  operationType: z.literal("CREATE"),
  department_id: z.uuid(),
  data_requirement_id: z.uuid(),
});

export type AssignDepartmentPicInput = z.infer<
  typeof assignDepartmentPicSchema
>;
