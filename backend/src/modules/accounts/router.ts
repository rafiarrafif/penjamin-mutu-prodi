import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import type { OpenAPIV3 } from "openapi-types";
import { googleAuthorizationCallbackController } from "./controllers/googleAuthorizationCallback.controller";
import { requestGoogleAuthorizationController } from "./controllers/requestGoogleAuthorization.controller";
import { unauthenticatedOnlyMiddleware } from "./middlewares/unauthenticatedOnly.middleware";

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
  );
