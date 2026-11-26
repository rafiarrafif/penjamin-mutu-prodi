import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { prisma } from "../../utils/prisma";
import { unauthenticatedOnlyMiddleware } from "./middlewares/unauthenticatedOnly.middleware";
import {
  requireRoleMiddleware,
  requireRoles,
} from "../../middlewares/requireRole.middleware";
import { FindActiveSessionRepository } from "../sessions/repositories/findActiveSession.repository";
import { FindActiveSessionService } from "../sessions/services/findActiveSession.service";
import { CreateSessionRepository } from "../sessions/repositories/createSession.repository";
import { CreateSessionService } from "../sessions/services/createSession.service";
import { RequestGoogleAuthorizationController } from "./controllers/requestGoogleAuthorization.controller";
import { RequestGoogleAuthorizationService } from "./services/requestGoogleAuthorization.service";
import { GoogleAuthorizationCallbackController } from "./controllers/googleAuthorizationCallback.controller";
import { GoogleAuthorizationCallbackService } from "./services/googleAuthorizationCallback.service";
import { UpdateGoogleAccountForLoginRepository } from "./repositories/updateGoogleAccountForLogin.repository";
import { CreateAccountController } from "./controllers/createAccount.controller";
import { CreateAccountService } from "./services/createAccount.service";
import { CreateAccountRepository } from "./repositories/createAccount.repository";
import { ApprovalProvisionController } from "./controllers/approvalProvision.controller";
import { ApprovalProvisionService } from "./services/approvalProvision.service";
import { ApprovalProvisionRepository } from "./repositories/approvalProvision.repository";
import { EditFromAdminController } from "./controllers/editFromAdmin.controller";
import { EditFromAdminService } from "./services/editFromAdmin.service";
import { EditFromAdminRepository } from "./repositories/editFromAdmin.repository";
import { DeleteFromAdminController } from "./controllers/deleteFromAdmin.controller";
import { DeleteFromAdminService } from "./services/deleteFromAdmin.service";
import { DeleteFromAdminRepository } from "./repositories/deleteFromAdmin.repository";
import { SelfEditController } from "./controllers/selfEdit.controller";
import { SelfEditService } from "./services/selfEdit.service";
import { SelfEditRepository } from "./repositories/selfEdit.repository";
import { requestGoogleAuthorizationDocumentation } from "./documentations/requestGoogleAuthorization.documentation";
import { googleAuthorizationCallbackDocumentation } from "./documentations/googleAuthorizationCallback.documentation";
import { createAccountDocumentation } from "./documentations/createAccount.documentation";
import { approvalProvisionDocumentation } from "./documentations/approvalProvision.documentation";
import { editFromAdminDocumentation } from "./documentations/editFromAdmin.documentation";
import { deleteFromAdminDocumentation } from "./documentations/deleteFromAdmin.documentation";
import { selfEditDocumentation } from "./documentations/selfEdit.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

const activeSessionService = new FindActiveSessionService(
  new FindActiveSessionRepository(prisma),
);
const createSessionService = new CreateSessionService(
  new CreateSessionRepository(prisma),
);

const requestController = new RequestGoogleAuthorizationController(
  new RequestGoogleAuthorizationService(),
);
const googleCallbackService = new GoogleAuthorizationCallbackService(
  new UpdateGoogleAccountForLoginRepository(prisma),
  createSessionService,
);
const googleCallbackController = new GoogleAuthorizationCallbackController(
  googleCallbackService,
);

const createController = new CreateAccountController(
  new CreateAccountService(new CreateAccountRepository(prisma)),
);
const approvalController = new ApprovalProvisionController(
  new ApprovalProvisionService(new ApprovalProvisionRepository(prisma)),
);
const editController = new EditFromAdminController(
  new EditFromAdminService(new EditFromAdminRepository(prisma)),
);
const deleteController = new DeleteFromAdminController(
  new DeleteFromAdminService(new DeleteFromAdminRepository(prisma)),
);
const selfEditController = new SelfEditController(
  new SelfEditService(new SelfEditRepository(prisma)),
);

export const accountsRouter = new Elysia({ name: "accounts" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .onBeforeHandle(unauthenticatedOnlyMiddleware)
  .post(
    "/accounts/auth/request/google",
    (context) => requestController.handle(context),
    { detail: requestGoogleAuthorizationDocumentation },
  )
  .get(
    "/accounts/auth/callback/google",
    (context) => googleCallbackController.handle(context),
    { detail: googleAuthorizationCallbackDocumentation },
  )
  .derive(requireRoles(["admin", "director"], activeSessionService))
  .post("/accounts/", (context) => createController.handle(context), {
    detail: createAccountDocumentation,
  })
  .derive(requireRoles(["admin", "director"], activeSessionService))
  .post(
    "/accounts/approvalprovision",
    (context) => approvalController.handle(context),
    { detail: approvalProvisionDocumentation },
  )
  .derive(requireRoles(["admin", "director"], activeSessionService))
  .post(
    "/accounts/editfromadmin",
    (context) => editController.handle(context),
    { detail: editFromAdminDocumentation },
  )
  .post(
    "/accounts/deletefromadmin",
    (context) => deleteController.handle(context),
    { detail: deleteFromAdminDocumentation },
  )
  .derive(requireRoleMiddleware("lecturer", activeSessionService))
  .post("/accounts/selfedit", (context) => selfEditController.handle(context), {
    detail: selfEditDocumentation,
  });
