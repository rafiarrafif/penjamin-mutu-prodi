import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { prisma } from "../../utils/prisma";
import { requireAuthSessionMiddleware } from "./middlewares/requireAuthSession.middleware";
import { RevokeCurrentController } from "./controllers/revokeCurrent.controller";
import { RevokeCurrentService } from "./services/revokeCurrent.service";
import { RevokeCurrentRepository } from "./repositories/revokeCurrent.repository";
import { revokeCurrentDocumentation } from "./documentations/revokeCurrent.documentation";
import { GetCurrentSessionController } from "./controllers/getCurrentSession.controller";
import { GetCurrentSessionService } from "./services/getCurrentSession.service";
import { getCurrentSessionDocumentation } from "./documentations/getCurrentSession.documentation";
import { FindActiveSessionRepository } from "./repositories/findActiveSession.repository";
import { FindActiveSessionService } from "./services/findActiveSession.service";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const activeSessionService = new FindActiveSessionService(
  new FindActiveSessionRepository(prisma),
);
const repository = new RevokeCurrentRepository(prisma);
const service = new RevokeCurrentService(repository);
const controller = new RevokeCurrentController(service);
const getCurrentController = new GetCurrentSessionController(
  new GetCurrentSessionService(),
);

export const sessionsRouter = new Elysia({ name: "sessions" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .derive(requireAuthSessionMiddleware(activeSessionService))
  .post("/sessions/revokecurrent", (context) => controller.handle(context), {
    detail: revokeCurrentDocumentation,
  })
  .post("/session/current", (context) => getCurrentController.handle(context), {
    detail: getCurrentSessionDocumentation,
  });
