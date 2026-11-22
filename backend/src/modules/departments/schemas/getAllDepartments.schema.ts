import { z } from "zod";

export const getAllDepartmentsSchema = z.object({
  operationType: z.literal("READ"),
});

export type GetAllDepartmentsInput = z.infer<typeof getAllDepartmentsSchema>;
