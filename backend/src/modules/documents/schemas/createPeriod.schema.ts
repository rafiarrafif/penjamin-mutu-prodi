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

export const createPeriodSchema = z
  .object({
    operationType: z.literal("CREATE"),
    frequency_code: z.string().min(1).max(32),
    label: z.string().min(1).max(64),
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12).optional(),
    semester: z.union([z.literal(1), z.literal(2)]).optional(),
    start_date: dateString,
    end_date: dateString,
  })
  .refine((value) => value.end_date >= value.start_date, {
    message: "end_date must not be earlier than start_date",
    path: ["end_date"],
  });

export type CreatePeriodInput = z.infer<typeof createPeriodSchema>;
