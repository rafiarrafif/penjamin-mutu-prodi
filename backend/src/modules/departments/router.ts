import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { prisma } from "../../utils/prisma";
import { requireRoles } from "../../middlewares/requireRole.middleware";
import { FindActiveSessionRepository } from "../sessions/repositories/findActiveSession.repository";
import { FindActiveSessionService } from "../sessions/services/findActiveSession.service";
import { AppendActionLogRepository } from "../logs/repositories/appendActionLog.repository";
import { AppendActionLogService } from "../logs/services/appendActionLog.service";

import { CreateNewDepartmentController } from "./controllers/createNewDepartment.controller";
import { CreateNewDepartmentService } from "./services/createNewDepartment.service";
import { CreateNewDepartmentRepository } from "./repositories/createNewDepartment.repository";
import { createNewDepartmentDocumentation } from "./documentations/createNewDepartment.documentation";

import { GetAllDepartmentsController } from "./controllers/getAllDepartments.controller";
import { GetAllDepartmentsService } from "./services/getAllDepartments.service";
import { GetAllDepartmentsRepository } from "./repositories/getAllDepartments.repository";
import { getAllDepartmentsDocumentation } from "./documentations/getAllDepartments.documentation";
import { GetSpecificDepartmentController } from "./controllers/getSpecificDepartment.controller";
import { GetSpecificDepartmentService } from "./services/getSpecificDepartment.service";
import { GetSpecificDepartmentRepository } from "./repositories/getSpecificDepartment.repository";
import { getSpecificDepartmentDocumentation } from "./documentations/getSpecificDepartment.documentation";
import { EditDepartmentController } from "./controllers/editDepartment.controller";
import { EditDepartmentService } from "./services/editDepartment.service";
import { EditDepartmentRepository } from "./repositories/editDepartment.repository";
import { editDepartmentDocumentation } from "./documentations/editDepartment.documentation";
import { DeleteDepartmentController } from "./controllers/deleteDepartment.controller";
import { DeleteDepartmentService } from "./services/deleteDepartment.service";
import { DeleteDepartmentRepository } from "./repositories/deleteDepartment.repository";
import { deleteDepartmentDocumentation } from "./documentations/deleteDepartment.documentation";

import { AssignDepartmentMemberController } from "./controllers/assignDepartmentMember.controller";
import { AssignDepartmentMemberService } from "./services/assignDepartmentMember.service";
import { AssignDepartmentMemberRepository } from "./repositories/assignDepartmentMember.repository";
import { assignDepartmentMemberDocumentation } from "./documentations/assignDepartmentMember.documentation";
import { UnassignDepartmentMemberController } from "./controllers/unassignDepartmentMember.controller";
import { UnassignDepartmentMemberService } from "./services/unassignDepartmentMember.service";
import { UnassignDepartmentMemberRepository } from "./repositories/unassignDepartmentMember.repository";
import { unassignDepartmentMemberDocumentation } from "./documentations/unassignDepartmentMember.documentation";
import { GetDepartmentMembersController } from "./controllers/getDepartmentMembers.controller";
import { GetDepartmentMembersService } from "./services/getDepartmentMembers.service";
import { GetDepartmentMembersRepository } from "./repositories/getDepartmentMembers.repository";
import { getDepartmentMembersDocumentation } from "./documentations/getDepartmentMembers.documentation";
import { AssignDepartmentPicController } from "./controllers/assignDepartmentPic.controller";
import { AssignDepartmentPicService } from "./services/assignDepartmentPic.service";
import { AssignDepartmentPicRepository } from "./repositories/assignDepartmentPic.repository";
import { assignDepartmentPicDocumentation } from "./documentations/assignDepartmentPic.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const activeSessionService = new FindActiveSessionService(
  new FindActiveSessionRepository(prisma),
);
const actionLogService = new AppendActionLogService(
  new AppendActionLogRepository(prisma),
);

const createController = new CreateNewDepartmentController(
  new CreateNewDepartmentService(new CreateNewDepartmentRepository(prisma)),
);
const getAllController = new GetAllDepartmentsController(
  new GetAllDepartmentsService(new GetAllDepartmentsRepository(prisma)),
);
const getSpecificController = new GetSpecificDepartmentController(
  new GetSpecificDepartmentService(new GetSpecificDepartmentRepository(prisma)),
);
const editController = new EditDepartmentController(
  new EditDepartmentService(
    new EditDepartmentRepository(prisma),
    actionLogService,
  ),
);
const deleteController = new DeleteDepartmentController(
  new DeleteDepartmentService(
    new DeleteDepartmentRepository(prisma),
    actionLogService,
  ),
);
const assignMemberController = new AssignDepartmentMemberController(
  new AssignDepartmentMemberService(
    new AssignDepartmentMemberRepository(prisma),
    actionLogService,
  ),
);
const unassignMemberController = new UnassignDepartmentMemberController(
  new UnassignDepartmentMemberService(
    new UnassignDepartmentMemberRepository(prisma),
    actionLogService,
  ),
);
const getMembersController = new GetDepartmentMembersController(
  new GetDepartmentMembersService(new GetDepartmentMembersRepository(prisma)),
);
const assignPicController = new AssignDepartmentPicController(
  new AssignDepartmentPicService(
    new AssignDepartmentPicRepository(prisma),
    actionLogService,
  ),
);

export const departmentsRouter = new Elysia({ name: "departments" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(
    requireRoles(
      ["lecturer", "verifier", "verificator", "admin", "director"],
      activeSessionService,
    ),
  )
  .post(
    "/departments/getalllist",
    (context) => getAllController.handle(context),
    { detail: getAllDepartmentsDocumentation },
  )
  .post(
    "/departments/getspecific",
    (context) => getSpecificController.handle(context),
    { detail: getSpecificDepartmentDocumentation },
  )
  .post(
    "/departments/members/getlist",
    (context) => getMembersController.handle(context),
    { detail: getDepartmentMembersDocumentation },
  )
  .derive(requireRoles(["admin", "director"], activeSessionService))
  .post("/departments/", (context) => createController.handle(context), {
    detail: createNewDepartmentDocumentation,
  })
  .post("/departments/edit", (context) => editController.handle(context), {
    detail: editDepartmentDocumentation,
  })
  .post("/departments/delete", (context) => deleteController.handle(context), {
    detail: deleteDepartmentDocumentation,
  })
  .post(
    "/departments/members/assign",
    (context) => assignMemberController.handle(context),
    { detail: assignDepartmentMemberDocumentation },
  )
  .post(
    "/departments/members/unassign",
    (context) => unassignMemberController.handle(context),
    { detail: unassignDepartmentMemberDocumentation },
  )
  .post(
    "/departments/pics/assign",
    (context) => assignPicController.handle(context),
    { detail: assignDepartmentPicDocumentation },
  );
