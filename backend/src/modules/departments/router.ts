import { Elysia, t } from "elysia";
import "dotenv/config";
import { jwt } from "@elysia/jwt";
import type { OpenAPIV3 } from "openapi-types";
import { createNewDepartmentController } from "./controllers/createNewDepartment.controller";
import { requireRoleMiddleware } from "../../middlewares/requireRole.middleware";

const responseMessage = t.Object({
  title: t.String(),
  description: t.String(),
});

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

export const departmentsRouter = new Elysia({ name: "departments" })
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(requireRoleMiddleware("admin"))
  .post("/departments/", (context) => createNewDepartmentController(context), {
    detail: {
      summary: "Create a department",
      description:
        "Add a department to the system. Requires an authenticated admin or director.",
      tags: ["Departments"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["operationType", "name"],
              properties: {
                operationType: { type: "string", enum: ["CREATE"] },
                name: { type: "string", minLength: 1, maxLength: 115 },
                description: { type: "string", maxLength: 255 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Department created.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["success", "status", "message", "data"],
                properties: {
                  success: { type: "boolean", enum: [true] },
                  status: { type: "integer", enum: [201] },
                  message: responseMessage as unknown as OpenAPIV3.SchemaObject,
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", maxLength: 115 },
                        description: { type: "string", nullable: true },
                        accountIdCreator: { type: "string", format: "uuid" },
                        accountIdUpdater: {
                          type: "string",
                          format: "uuid",
                          nullable: true,
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        deletedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "A valid signed JWT and active session are required.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        403: {
          description: "The authenticated account is below admin role.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        400: {
          description: "The request body is invalid.",
          content: { "application/json": { schema: errorEnvelope } },
        },
        500: {
          description: "Department could not be created.",
          content: { "application/json": { schema: errorEnvelope } },
        },
      },
    },
  });
