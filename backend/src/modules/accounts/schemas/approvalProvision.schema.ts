import { z } from "zod";

export const approvalProvisionSchema = z.object({
  operationType: z.literal("UPDATE"),
  email: z.string().email().max(255),
});

export type ApprovalProvisionInput = z.infer<typeof approvalProvisionSchema>;
