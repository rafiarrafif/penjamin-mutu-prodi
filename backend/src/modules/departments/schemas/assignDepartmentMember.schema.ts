import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Date must be a valid calendar date.");

export const assignDepartmentMemberSchema = z.object({
  operationType: z.literal("CREATE"),
  department_id: z.uuid(),
  account_id: z.uuid(),
  start_date: dateSchema.optional(),
});

export type AssignDepartmentMemberInput = z.infer<
  typeof assignDepartmentMemberSchema
>;
