import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import { googleAuthorizationCallbackController } from "./controllers/googleAuthorizationCallback.controller";
import { requestGoogleAuthorizationController } from "./controllers/requestGoogleAuthorization.controller";
import { unauthenticatedOnlyMiddleware } from "./middlewares/unauthenticatedOnly.middleware";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { createAccountController } from "./controllers/createAccount.controller";
import { approvalProvisionController } from "./controllers/approvalProvision.controller";
import { editFromAdminController } from "./controllers/editFromAdmin.controller";
import { deleteFromAdminController } from "./controllers/deleteFromAdmin.controller";
import { selfEditController } from "./controllers/selfEdit.controller";
import { requestGoogleAuthorizationDocumentation } from "./documentations/requestGoogleAuthorization.documentation";
import { googleAuthorizationCallbackDocumentation } from "./documentations/googleAuthorizationCallback.documentation";
import { createAccountDocumentation } from "./documentations/createAccount.documentation";
import { approvalProvisionDocumentation } from "./documentations/approvalProvision.documentation";
import { editFromAdminDocumentation } from "./documentations/editFromAdmin.documentation";
import { deleteFromAdminDocumentation } from "./documentations/deleteFromAdmin.documentation";
import { selfEditDocumentation } from "./documentations/selfEdit.documentation";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const accountsRouter = new Elysia({ name: "accounts" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .onBeforeHandle(unauthenticatedOnlyMiddleware)
  .post("/accounts/auth/request/google", requestGoogleAuthorizationController, {
    detail: requestGoogleAuthorizationDocumentation,
  })
  .get(
    "/accounts/auth/callback/google",
    googleAuthorizationCallbackController,
    { detail: googleAuthorizationCallbackDocumentation },
  )
  .derive(requireRoleMiddleware("admin"))
  .post("/accounts/", (context) => createAccountController(context), {
    detail: createAccountDocumentation,
  })
  .derive(requireRoleMiddleware("director"))
  .post(
    "/accounts/approvalprovision",
    (context) => approvalProvisionController(context),
    { detail: approvalProvisionDocumentation },
  )
  .derive(requireRoleMiddleware("admin"))
  .post(
    "/accounts/editfromadmin",
    (context) => editFromAdminController(context),
    { detail: editFromAdminDocumentation },
  )
  .post(
    "/accounts/deletefromadmin",
    (context) => deleteFromAdminController(context),
    { detail: deleteFromAdminDocumentation },
  )
  .derive(requireRoleMiddleware("lecturer"))
  .post("/accounts/selfedit", (context) => selfEditController(context), {
    detail: selfEditDocumentation,
  });
