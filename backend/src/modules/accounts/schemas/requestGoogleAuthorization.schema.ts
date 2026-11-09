import { z } from "zod";

export const googleAuthorizationUrlSchema = z.object({
  state: z.string().min(1),
  authorizationUrl: z.url(),
});