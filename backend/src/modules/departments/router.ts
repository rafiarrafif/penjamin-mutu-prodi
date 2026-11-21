import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { prisma } from "../../utils/prisma";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { CreateNewDepartmentController } from "./controllers/createNewDepartment.controller";
import { CreateNewDepartmentService } from "./services/createNewDepartment.service";
import { CreateNewDepartmentRepository } from "./repositories/createNewDepartment.repository";
import { createNewDepartmentDocumentation } from "./documentations/createNewDepartment.documentation";
import { FindActiveSessionRepository } from "../sessions/repositories/findActiveSession.repository";
import { FindActiveSessionService } from "../sessions/services/findActiveSession.service";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const repository = new CreateNewDepartmentRepository(prisma);
const service = new CreateNewDepartmentService(repository);
const controller = new CreateNewDepartmentController(service);
const activeSessionService = new FindActiveSessionService(
  new FindActiveSessionRepository(prisma),
);

export const departmentsRouter = new Elysia({ name: "departments" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("admin", activeSessionService))
  .post("/departments/", (context) => controller.handle(context), {
    detail: createNewDepartmentDocumentation,
  });
