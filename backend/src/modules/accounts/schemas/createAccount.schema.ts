import { z } from "zod";

export const createAccountSchema = z.object({
  operationType: z.literal("CREATE"),
  fullname: z.string().min(1).max(255),
  email: z.email().max(255),
  role: z.enum(["director", "admin", "verificator", "lecturer"]),
  sex: z.enum(["male", "female"]),
  phone_no: z.string().max(15).optional(),
  address: z.string().max(255).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
