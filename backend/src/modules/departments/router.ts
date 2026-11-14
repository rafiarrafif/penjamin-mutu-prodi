import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { createNewDepartmentController } from "./controllers/createNewDepartment.controller";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { createNewDepartmentDocumentation } from "./documentations/createNewDepartment.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const departmentsRouter = new Elysia({ name: "departments" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("admin"))
  .post("/departments/", (context) => createNewDepartmentController(context), {
    detail: createNewDepartmentDocumentation,
  });
