import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { createDataCategoryController } from "./controllers/createDataCategory.controller";
import { createDataCategoryDocumentation } from "./documentations/createDataCategory.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const documentsRouter = new Elysia({ name: "documents" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("admin"))
  .post(
    "/documents/categories/",
    (context) => createDataCategoryController(context),
    { detail: createDataCategoryDocumentation },
  );
