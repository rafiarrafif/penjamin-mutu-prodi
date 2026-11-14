import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { revokeCurrentController } from "./controllers/revokeCurrent.controller";
import { requireAuthSessionMiddleware } from "./middlewares/requireAuthSession.middleware";
import { revokeCurrentDocumentation } from "./documentations/revokeCurrent.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const sessionsRouter = new Elysia({ name: "sessions" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .derive(requireAuthSessionMiddleware)
  .post(
    "/sessions/revokecurrent",
    (context) => revokeCurrentController(context),
    { detail: revokeCurrentDocumentation },
  );
