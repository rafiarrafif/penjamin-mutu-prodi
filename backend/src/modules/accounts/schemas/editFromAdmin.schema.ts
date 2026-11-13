import { z } from "zod";

export const editFromAdminSchema = z.object({
  operationType: z.literal("UPDATE"),
  account_id: z.string().min(1),
  email: z.string().email().max(255).optional(),
  fullname: z.string().min(1).max(255).optional(),
  role: z.enum(["director", "admin", "verificator", "lecturer"]).optional(),
  sex: z.string().max(6).optional(),
  phone_no: z.string().max(15).optional(),
  address: z.string().max(255).optional(),
});

export type EditFromAdminInput = z.infer<typeof editFromAdminSchema>;
