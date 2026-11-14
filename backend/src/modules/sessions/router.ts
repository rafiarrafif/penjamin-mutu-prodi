import { Elysia } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import type { OpenAPIV3 } from "openapi-types";
import { revokeCurrentController } from "./controllers/revokeCurrent.controller";
import { requireAuthSessionMiddleware } from "./middlewares/requireAuthSession.middleware";

const successEnvelope: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "status", "message"],
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

export const sessionsRouter = new Elysia({ name: "sessions" })
  .use(jwt({ name: "jwt", secret: jwtSecret, exp: "7d" }))
  .derive(requireAuthSessionMiddleware)
  .post(
    "/sessions/revokecurrent",
    (context) => revokeCurrentController(context),
    {
      detail: {
        summary: "Revoke current session",
        description:
          "End the current JWT session by setting revoked_at to the current time. Only the session owner can revoke their own session.",
        tags: ["Sessions"],
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
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Session was successfully revoked.",
            content: {
              "application/json": {
                schema: successEnvelope,
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
          404: {
            description: "The session was not found or is already revoked.",
            content: { "application/json": { schema: errorEnvelope } },
          },
        },
      },
    },
  );
