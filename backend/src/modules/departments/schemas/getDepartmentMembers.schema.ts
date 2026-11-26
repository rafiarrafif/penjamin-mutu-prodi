import { z } from "zod";

export const getDepartmentMembersSchema = z.object({
  operationType: z.literal("READ"),
  department_id: z.uuid(),
  include_ended: z.boolean().optional().default(false),
});

export type GetDepartmentMembersInput = z.infer<
  typeof getDepartmentMembersSchema
>;
