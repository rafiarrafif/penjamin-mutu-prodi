import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import type { OpenAPIV3 } from "openapi-types";
import { googleAuthorizationCallbackController } from "./controllers/googleAuthorizationCallback.controller";
import { requestGoogleAuthorizationController } from "./controllers/requestGoogleAuthorization.controller";
import { unauthenticatedOnlyMiddleware } from "./middlewares/unauthenticatedOnly.middleware";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";
import { createAccountController } from "./controllers/createAccount.controller";
import { approvalProvisionController } from "./controllers/approvalProvision.controller";
import { editFromAdminController } from "./controllers/editFromAdmin.controller";
import { selfEditController } from "./controllers/selfEdit.controller";

const successEnvelope: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "status", "message", "data"],
  properties: {
    success: { type: "boolean", enum: [true] },
    status: { type: "integer", enum: [200] },
    message: {
      type: "object",
      required: ["title", "description"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
    data: { type: "array", items: { type: "object" } },
  },
};

const errorEnvelope: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "status", "message", "errors"],
  properties: {
    success: { type: "boolean", enum: [false] },
    status: { type: "integer" },
    message: {
      type: "object",
      required: ["title", "description"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
    errors: { type: "array", items: {} },
  },
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const accountsRouter = new Elysia({ name: "accounts" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .onBeforeHandle(unauthenticatedOnlyMiddleware)
  .post("/accounts/auth/request/google", requestGoogleAuthorizationController, {
    detail: {
      summary: "Request Google login URL",
      description:
        "Create a PKCE-protected Google authorization URL and store the verifier for the callback.",
      tags: ["Google OAuth"],
      responses: {
        200: {
          description: "Authorization URL created.",
          content: {
            "application/json": {
              schema: {
                ...successEnvelope,
                properties: {
                  ...successEnvelope.properties,
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["authorizationUrl"],
                      properties: {
                        authorizationUrl: { type: "string", format: "uri" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "OAuth or Redis service could not be initialized.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        401: {
          description: "This endpoint is only available to logged-out users.",
          content: { "application/json": { schema: errorEnvelope } },
        },
      },
    },
  })
  .get(
    "/accounts/auth/callback/google",
    googleAuthorizationCallbackController,
    {
      detail: {
        summary: "Complete Google login",
        description:
          "Validate Google's OAuth callback, require an existing provisioned account, and create a session without issuing a JWT.",
        tags: ["Google OAuth"],
        parameters: [
          {
            name: "code",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Authorization code returned by Google.",
          },
          {
            name: "state",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "OAuth state value returned by Google.",
          },
          {
            name: "error",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "OAuth error returned when authorization is denied.",
          },
        ],
        responses: {
          200: {
            description:
              "An existing account was authenticated and a signed JWT was issued.",
            content: {
              "application/json": {
                schema: {
                  ...successEnvelope,
                  properties: {
                    ...successEnvelope.properties,
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["token"],
                        properties: { token: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "The callback query or OAuth state is invalid or expired.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          403: {
            description:
              "Google email is unverified or no account is provisioned for it.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          502: {
            description:
              "Google returned a profile that could not be validated.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          500: {
            description: "OAuth provider, Redis, or database operation failed.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          401: {
            description: "This endpoint is only available to logged-out users.",
            content: { "application/json": { schema: errorEnvelope } },
          },
        },
      },
    },
  )
  .derive(requireRoleMiddleware("admin"))
  .post("/accounts/", (context) => createAccountController(context), {
    detail: {
      summary: "Create an account",
      description:
        "Create an account with an admin-set or director-set verification default.",
      tags: ["Accounts"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["operationType", "fullname", "email", "role", "sex"],
              properties: {
                operationType: { type: "string", enum: ["CREATE"] },
                fullname: { type: "string", maxLength: 255 },
                email: { type: "string", format: "email", maxLength: 255 },
                role: {
                  type: "string",
                  enum: ["director", "admin", "verificator", "lecturer"],
                },
                sex: { type: "string", enum: ["male", "female"] },
                phone_no: { type: "string", maxLength: 15 },
                address: { type: "string", maxLength: 255 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Account created and inserted data returned.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["success", "status", "message", "data"],
                properties: {
                  success: { type: "boolean", enum: [true] },
                  status: { type: "integer", enum: [201] },
                  message: {
                    type: "object",
                    required: ["title", "description"],
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                    },
                  },
                  data: { type: "array", items: { type: "object" } },
                },
              },
            },
          },
        },
        400: {
          description: "The account request body is invalid.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        401: {
          description: "A valid signed JWT and active session are required.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        403: {
          description: "The authenticated account is below admin role.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        409: {
          description: "The account email conflicts with an existing account.",
          content: { "application/json": { schema: errorEnvelope } },
        },
      },
    },
  })
  .derive(requireRoleMiddleware("director"))
  .post(
    "/accounts/approvalProvision",
    (context) => approvalProvisionController(context),
    {
      detail: {
        summary: "Approve account provision",
        description:
          "Activate an account by changing is_verified from false to true. Only directors can approve accounts. Returns 201 if already verified.",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["operationType", "email"],
                properties: {
                  operationType: { type: "string", enum: ["UPDATE"] },
                  email: { type: "string", format: "email", maxLength: 255 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Account was successfully verified and the updated account data is returned.",
            content: {
              "application/json": {
                schema: {
                  ...successEnvelope,
                  properties: {
                    ...successEnvelope.properties,
                    status: { type: "integer", enum: [200] },
                  },
                },
              },
            },
          },
          201: {
            description:
              "Account was already verified and no changes were made.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["success", "status", "message", "data"],
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    status: { type: "integer", enum: [201] },
                    message: {
                      type: "object",
                      required: ["title", "description"],
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                    data: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          400: {
            description: "The request body is invalid.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          401: {
            description: "A valid signed JWT and active session are required.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          403: {
            description: "The authenticated account is not a director.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          404: {
            description: "No account found with the provided email.",
            content: { "application/json": { schema: errorEnvelope } },
          },
        },
      },
    },
  )
  .derive(requireRoleMiddleware("admin"))
  .post(
    "/accounts/editfromadmin",
    (context) => editFromAdminController(context),
    {
      detail: {
        summary: "Edit account from admin",
        description:
          "Modify account details. Admin and director roles can edit other accounts, but director accounts cannot be edited via this method. Only directors may change the role field.",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["operationType", "account_id"],
                properties: {
                  operationType: { type: "string", enum: ["UPDATE"] },
                  account_id: { type: "string" },
                  email: { type: "string", format: "email", maxLength: 255 },
                  fullname: { type: "string", maxLength: 255 },
                  role: {
                    type: "string",
                    enum: ["director", "admin", "verificator", "lecturer"],
                  },
                  sex: { type: "string", maxLength: 6 },
                  phone_no: { type: "string", maxLength: 15 },
                  address: { type: "string", maxLength: 255 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Account was successfully updated.",
            content: {
              "application/json": {
                schema: {
                  ...successEnvelope,
                  properties: {
                    ...successEnvelope.properties,
                    status: { type: "integer", enum: [200] },
                  },
                },
              },
            },
          },
          400: {
            description: "The request body is invalid.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          401: {
            description: "A valid signed JWT and active session are required.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          403: {
            description:
              "The authenticated account is below admin role, or attempted to change role without director permissions, or attempted to edit a director account.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          404: {
            description: "No account found with the provided ID.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          409: {
            description: "The email conflicts with an existing account.",
            content: { "application/json": { schema: errorEnvelope } },
          },
        },
      },
    },
  )
  .derive(requireRoleMiddleware("lecturer"))
  .post(
    "/accounts/selfedit",
    (context) => selfEditController(context),
    {
      detail: {
        summary: "Edit own account",
        description:
          "Allow authenticated users to edit their own account details. Only directors may change their own role field.",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["operationType"],
                properties: {
                  operationType: { type: "string", enum: ["UPDATE"] },
                  email: { type: "string", format: "email", maxLength: 255 },
                  fullname: { type: "string", maxLength: 255 },
                  role: {
                    type: "string",
                    enum: ["director", "admin", "verificator", "lecturer"],
                  },
                  sex: { type: "string", maxLength: 6 },
                  phone_no: { type: "string", maxLength: 15 },
                  address: { type: "string", maxLength: 255 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Account was successfully updated.",
            content: {
              "application/json": {
                schema: {
                  ...successEnvelope,
                  properties: {
                    ...successEnvelope.properties,
                    status: { type: "integer", enum: [200] },
                  },
                },
              },
            },
          },
          400: {
            description: "The request body is invalid.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          401: {
            description: "A valid signed JWT and active session are required.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          403: {
            description:
              "Attempted to change role field without director permissions.",
            content: { "application/json": { schema: errorEnvelope } },
          },
          409: {
            description: "The email conflicts with an existing account.",
            content: { "application/json": { schema: errorEnvelope } },
          },
        },
      },
    },
  );
