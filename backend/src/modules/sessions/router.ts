import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { prisma } from "../../utils/prisma";
import { requireAuthSessionMiddleware } from "./middlewares/requireAuthSession.middleware";
import { RevokeCurrentController } from "./controllers/revokeCurrent.controller";
import { RevokeCurrentService } from "./services/revokeCurrent.service";
import { RevokeCurrentRepository } from "./repositories/revokeCurrent.repository";
import { revokeCurrentDocumentation } from "./documentations/revokeCurrent.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const repository = new RevokeCurrentRepository(prisma);
const service = new RevokeCurrentService(repository);
const controller = new RevokeCurrentController(service);

export const sessionsRouter = new Elysia({ name: "sessions" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .derive(requireAuthSessionMiddleware)
  .post("/sessions/revokecurrent", (context) => controller.handle(context), {
    detail: revokeCurrentDocumentation,
  });
