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

export const selfEditDocumentation: OpenAPIV3.OperationObject = {
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
};
