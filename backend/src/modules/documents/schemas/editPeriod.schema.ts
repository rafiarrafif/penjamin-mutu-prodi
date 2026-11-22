import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Invalid date");

export const editPeriodSchema = z
  .object({
    operationType: z.literal("UPDATE"),
    period_id: z.string().uuid(),
    label: z.string().min(1).max(64).optional(),
    year: z.number().int().min(2000).max(2100).optional(),
    month: z.number().int().min(1).max(12).nullable().optional(),
    semester: z
      .union([z.literal(1), z.literal(2)])
      .nullable()
      .optional(),
    start_date: dateString.optional(),
    end_date: dateString.optional(),
  })
  .superRefine((value, context) => {
    if (
      !value.label &&
      value.year === undefined &&
      value.month === undefined &&
      value.semester === undefined &&
      value.start_date === undefined &&
      value.end_date === undefined
    ) {
      context.addIssue({
        code: "custom",
        message: "At least one field besides period_id must be provided",
        path: ["period_id"],
      });
    }
  });

export type EditPeriodInput = z.infer<typeof editPeriodSchema>;
