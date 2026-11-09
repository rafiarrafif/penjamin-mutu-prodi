import { z } from "zod";

export const googleCallbackQuerySchema = z
  .object({
    code: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    error: z.string().optional(),
  })
  .superRefine((query, context) => {
    if (!query.error && (!query.code || !query.state)) {
      context.addIssue({
        code: "custom",
        message: "Google callback must include a code and state.",
      });
    }
  });

export const googleUserProfileSchema = z.object({
  sub: z.string().min(1),
  email: z.email(),
  email_verified: z.boolean().optional(),
  name: z.string().optional(),
  picture: z.url().optional(),
});