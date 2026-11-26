import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import {
  requireRoleMiddleware,
  requireRoles,
} from "../../middlewares/requireRole.middleware";
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

import { CreateFrequencyRepository } from "./repositories/createFrequency.repository";
import { CreateFrequencyService } from "./services/createFrequency.service";
import { CreateFrequencyController } from "./controllers/createFrequency.controller";
import { createFrequencyDocumentation } from "./documentations/createFrequency.documentation";
import { GetAllFrequenciesRepository } from "./repositories/getAllFrequencies.repository";
import { GetAllFrequenciesService } from "./services/getAllFrequencies.service";
import { GetAllFrequenciesController } from "./controllers/getAllFrequencies.controller";
import { getAllFrequenciesDocumentation } from "./documentations/getAllFrequencies.documentation";
import { EditFrequencyRepository } from "./repositories/editFrequency.repository";
import { EditFrequencyService } from "./services/editFrequency.service";
import { EditFrequencyController } from "./controllers/editFrequency.controller";
import { editFrequencyDocumentation } from "./documentations/editFrequency.documentation";
import { DeleteFrequencyRepository } from "./repositories/deleteFrequency.repository";
import { DeleteFrequencyService } from "./services/deleteFrequency.service";
import { DeleteFrequencyController } from "./controllers/deleteFrequency.controller";
import { deleteFrequencyDocumentation } from "./documentations/deleteFrequency.documentation";

import { CreatePeriodRepository } from "./repositories/createPeriod.repository";
import { CreatePeriodService } from "./services/createPeriod.service";
import { CreatePeriodController } from "./controllers/createPeriod.controller";
import { createPeriodDocumentation } from "./documentations/createPeriod.documentation";
import { GetAllPeriodsRepository } from "./repositories/getAllPeriods.repository";
import { GetAllPeriodsService } from "./services/getAllPeriods.service";
import { GetAllPeriodsController } from "./controllers/getAllPeriods.controller";
import { getAllPeriodsDocumentation } from "./documentations/getAllPeriods.documentation";
import { EditPeriodRepository } from "./repositories/editPeriod.repository";
import { EditPeriodService } from "./services/editPeriod.service";
import { EditPeriodController } from "./controllers/editPeriod.controller";
import { editPeriodDocumentation } from "./documentations/editPeriod.documentation";
import { DeletePeriodRepository } from "./repositories/deletePeriod.repository";
import { DeletePeriodService } from "./services/deletePeriod.service";
import { DeletePeriodController } from "./controllers/deletePeriod.controller";
import { deletePeriodDocumentation } from "./documentations/deletePeriod.documentation";

import { CreateRequirementRepository } from "./repositories/createRequirement.repository";
import { CreateRequirementService } from "./services/createRequirement.service";
import { CreateRequirementController } from "./controllers/createRequirement.controller";
import { createRequirementDocumentation } from "./documentations/createRequirement.documentation";
import { GetAllRequirementsRepository } from "./repositories/getAllRequirements.repository";
import { GetAllRequirementsService } from "./services/getAllRequirements.service";
import { GetAllRequirementsController } from "./controllers/getAllRequirements.controller";
import { getAllRequirementsDocumentation } from "./documentations/getAllRequirements.documentation";
import { GetSpecificRequirementRepository } from "./repositories/getSpecificRequirement.repository";
import { GetSpecificRequirementService } from "./services/getSpecificRequirement.service";
import { GetSpecificRequirementController } from "./controllers/getSpecificRequirement.controller";
import { getSpecificRequirementDocumentation } from "./documentations/getSpecificRequirement.documentation";
import { EditRequirementRepository } from "./repositories/editRequirement.repository";
import { EditRequirementService } from "./services/editRequirement.service";
import { EditRequirementController } from "./controllers/editRequirement.controller";
import { editRequirementDocumentation } from "./documentations/editRequirement.documentation";
import { DeleteRequirementRepository } from "./repositories/deleteRequirement.repository";
import { DeleteRequirementService } from "./services/deleteRequirement.service";
import { DeleteRequirementController } from "./controllers/deleteRequirement.controller";
import { deleteRequirementDocumentation } from "./documentations/deleteRequirement.documentation";

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

const createFrequencyController = new CreateFrequencyController(
  new CreateFrequencyService(
    new CreateFrequencyRepository(prisma),
    actionLogService,
  ),
);
const getAllFrequenciesController = new GetAllFrequenciesController(
  new GetAllFrequenciesService(new GetAllFrequenciesRepository(prisma)),
);
const editFrequencyController = new EditFrequencyController(
  new EditFrequencyService(
    new EditFrequencyRepository(prisma),
    actionLogService,
  ),
);
const deleteFrequencyController = new DeleteFrequencyController(
  new DeleteFrequencyService(
    new DeleteFrequencyRepository(prisma),
    actionLogService,
  ),
);

const createPeriodController = new CreatePeriodController(
  new CreatePeriodService(new CreatePeriodRepository(prisma), actionLogService),
);
const getAllPeriodsController = new GetAllPeriodsController(
  new GetAllPeriodsService(new GetAllPeriodsRepository(prisma)),
);
const editPeriodController = new EditPeriodController(
  new EditPeriodService(new EditPeriodRepository(prisma), actionLogService),
);
const deletePeriodController = new DeletePeriodController(
  new DeletePeriodService(new DeletePeriodRepository(prisma), actionLogService),
);

const createRequirementController = new CreateRequirementController(
  new CreateRequirementService(
    new CreateRequirementRepository(prisma),
    actionLogService,
  ),
);
const getAllRequirementsController = new GetAllRequirementsController(
  new GetAllRequirementsService(new GetAllRequirementsRepository(prisma)),
);
const getSpecificRequirementController = new GetSpecificRequirementController(
  new GetSpecificRequirementService(
    new GetSpecificRequirementRepository(prisma),
  ),
);
const editRequirementController = new EditRequirementController(
  new EditRequirementService(
    new EditRequirementRepository(prisma),
    actionLogService,
  ),
);
const deleteRequirementController = new DeleteRequirementController(
  new DeleteRequirementService(new DeleteRequirementRepository(prisma)),
);

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
  .post(
    "/documents/frequencies/getalllist",
    (context) => getAllFrequenciesController.handle(context),
    { detail: getAllFrequenciesDocumentation },
  )
  .post(
    "/documents/periods/getalllist",
    (context) => getAllPeriodsController.handle(context),
    { detail: getAllPeriodsDocumentation },
  )
  .post(
    "/documents/requirements/getalllist",
    (context) => getAllRequirementsController.handle(context),
    { detail: getAllRequirementsDocumentation },
  )
  .post(
    "/documents/requirements/getspecific",
    (context) => getSpecificRequirementController.handle(context),
    { detail: getSpecificRequirementDocumentation },
  )
  .derive(requireRoles(["admin", "director"], activeSessionService))
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
  )
  .post(
    "/documents/frequencies/",
    (context) => createFrequencyController.handle(context),
    { detail: createFrequencyDocumentation },
  )
  .post(
    "/documents/frequencies/edit",
    (context) => editFrequencyController.handle(context),
    { detail: editFrequencyDocumentation },
  )
  .post(
    "/documents/frequencies/delete",
    (context) => deleteFrequencyController.handle(context),
    { detail: deleteFrequencyDocumentation },
  )
  .post(
    "/documents/periods/",
    (context) => createPeriodController.handle(context),
    { detail: createPeriodDocumentation },
  )
  .post(
    "/documents/periods/edit",
    (context) => editPeriodController.handle(context),
    { detail: editPeriodDocumentation },
  )
  .post(
    "/documents/periods/delete",
    (context) => deletePeriodController.handle(context),
    { detail: deletePeriodDocumentation },
  )
  .post(
    "/documents/requirements/",
    (context) => createRequirementController.handle(context),
    { detail: createRequirementDocumentation },
  )
  .post(
    "/documents/requirements/edit",
    (context) => editRequirementController.handle(context),
    { detail: editRequirementDocumentation },
  )
  .post(
    "/documents/requirements/delete",
    (context) => deleteRequirementController.handle(context),
    { detail: deleteRequirementDocumentation },
  );
