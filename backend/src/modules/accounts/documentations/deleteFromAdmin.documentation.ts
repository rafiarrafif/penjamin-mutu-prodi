import type { OpenAPIV3 } from "openapi-types";

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
    data: {
      type: "array",
      items: {
        type: "object",
        required: ["email"],
        properties: { email: { type: "string", format: "email" } },
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

export const deleteFromAdminDocumentation: OpenAPIV3.OperationObject = {
  summary: "Delete an account from admin",
  description:
    "Soft-delete an account by email and revoke its active sessions. Requires an authenticated admin or director; director accounts cannot be deleted via this route.",
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
            operationType: { type: "string", enum: ["DELETE"] },
            email: { type: "string", format: "email", maxLength: 255 },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Account was soft-deleted; the deleted email is returned.",
      content: { "application/json": { schema: successEnvelope } },
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
      description: "Director accounts cannot be deleted via this route.",
      content: { "application/json": { schema: errorEnvelope } },
    },
    404: {
      description: "No active account was found with the provided email.",
      content: { "application/json": { schema: errorEnvelope } },
    },
  },
};
