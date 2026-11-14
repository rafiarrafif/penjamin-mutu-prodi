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

export const editFromAdminDocumentation: OpenAPIV3.OperationObject = {
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
};
