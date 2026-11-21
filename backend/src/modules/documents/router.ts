import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { prisma } from "../../utils/prisma";
import { FindActiveSessionRepository } from "../sessions/repositories/findActiveSession.repository";
import { FindActiveSessionService } from "../sessions/services/findActiveSession.service";
import { CreateDataCategoryController } from "./controllers/createDataCategory.controller";
import { CreateDataCategoryService } from "./services/createDataCategory.service";
import { CreateDataCategoryRepository } from "./repositories/createDataCategory.repository";
import { GetSpecificDataCategoryController } from "./controllers/getSpecificDataCategory.controller";
import { GetSpecificDataCategoryService } from "./services/getSpecificDataCategory.service";
import { GetSpecificDataCategoryRepository } from "./repositories/getSpecificDataCategory.repository";
import { EditDataCategoryController } from "./controllers/editDataCategory.controller";
import { EditDataCategoryService } from "./services/editDataCategory.service";
import { EditDataCategoryRepository } from "./repositories/editDataCategory.repository";
import { DeleteDataCategoryController } from "./controllers/deleteDataCategory.controller";
import { DeleteDataCategoryService } from "./services/deleteDataCategory.service";
import { DeleteDataCategoryRepository } from "./repositories/deleteDataCategory.repository";
import { GetAllDataCategoriesController } from "./controllers/getAllDataCategories.controller";
import { GetAllDataCategoriesService } from "./services/getAllDataCategories.service";
import { GetAllDataCategoriesRepository } from "./repositories/getAllDataCategories.repository";
import { AppendActionLogRepository } from "../logs/repositories/appendActionLog.repository";
import { AppendActionLogService } from "../logs/services/appendActionLog.service";
import { createDataCategoryDocumentation } from "./documentations/createDataCategory.documentation";
import { getAllDataCategoriesDocumentation } from "./documentations/getAllDataCategories.documentation";
import { getSpecificDataCategoryDocumentation } from "./documentations/getSpecificDataCategory.documentation";
import { editDataCategoryDocumentation } from "./documentations/editDataCategory.documentation";
import { deleteDataCategoryDocumentation } from "./documentations/deleteDataCategory.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const actionLogService = new AppendActionLogService(
  new AppendActionLogRepository(prisma),
);

const getAllRepository = new GetAllDataCategoriesRepository(prisma);
const getAllService = new GetAllDataCategoriesService(getAllRepository);
const getAllController = new GetAllDataCategoriesController(getAllService);

const getSpecificRepository = new GetSpecificDataCategoryRepository(prisma);
const getSpecificService = new GetSpecificDataCategoryService(
  getSpecificRepository,
);
const getSpecificController = new GetSpecificDataCategoryController(
  getSpecificService,
);

const createRepository = new CreateDataCategoryRepository(prisma);
const createService = new CreateDataCategoryService(
  createRepository,
  actionLogService,
);
const createController = new CreateDataCategoryController(createService);

const editRepository = new EditDataCategoryRepository(prisma);
const editService = new EditDataCategoryService(
  editRepository,
  actionLogService,
);
const editController = new EditDataCategoryController(editService);

const deleteRepository = new DeleteDataCategoryRepository(prisma);
const deleteService = new DeleteDataCategoryService(
  deleteRepository,
  actionLogService,
);
const deleteController = new DeleteDataCategoryController(deleteService);

const activeSessionService = new FindActiveSessionService(
  new FindActiveSessionRepository(prisma),
);

export const documentsRouter = new Elysia({ name: "documents" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("lecturer", activeSessionService))
  .post(
    "/documents/categories/getalllist",
    (context) => getAllController.handle(context),
    { detail: getAllDataCategoriesDocumentation },
  )
  .post(
    "/documents/categories/getspecific",
    (context) => getSpecificController.handle(context),
    { detail: getSpecificDataCategoryDocumentation },
  )
  .derive(requireRoleMiddleware("admin", activeSessionService))
  .post(
    "/documents/categories/",
    (context) => createController.handle(context),
    { detail: createDataCategoryDocumentation },
  )
  .post(
    "/documents/categories/edit",
    (context) => editController.handle(context),
    { detail: editDataCategoryDocumentation },
  )
  .post(
    "/documents/categories/delete",
    (context) => deleteController.handle(context),
    { detail: deleteDataCategoryDocumentation },
  );
