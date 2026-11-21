import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { createDataCategoryController } from "./controllers/createDataCategory.controller";
import { getAllDataCategoriesController } from "./controllers/getAllDataCategories.controller";
import { getSpecificDataCategoryController } from "./controllers/getSpecificDataCategory.controller";
import { editDataCategoryController } from "./controllers/editDataCategory.controller";
import { deleteDataCategoryController } from "./controllers/deleteDataCategory.controller";
import { createDataCategoryDocumentation } from "./documentations/createDataCategory.documentation";
import { getAllDataCategoriesDocumentation } from "./documentations/getAllDataCategories.documentation";
import { getSpecificDataCategoryDocumentation } from "./documentations/getSpecificDataCategory.documentation";
import { editDataCategoryDocumentation } from "./documentations/editDataCategory.documentation";
import { deleteDataCategoryDocumentation } from "./documentations/deleteDataCategory.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const documentsRouter = new Elysia({ name: "documents" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("lecturer"))
  .post(
    "/documents/categories/getalllist",
    (context) => getAllDataCategoriesController(context),
    { detail: getAllDataCategoriesDocumentation },
  )
  .post(
    "/documents/categories/getspecific",
    (context) => getSpecificDataCategoryController(context),
    { detail: getSpecificDataCategoryDocumentation },
  )
  .derive(requireRoleMiddleware("admin"))
  .post(
    "/documents/categories/",
    (context) => createDataCategoryController(context),
    { detail: createDataCategoryDocumentation },
  )
  .post(
    "/documents/categories/edit",
    (context) => editDataCategoryController(context),
    { detail: editDataCategoryDocumentation },
  )
  .post(
    "/documents/categories/delete",
    (context) => deleteDataCategoryController(context),
    { detail: deleteDataCategoryDocumentation },
  );
