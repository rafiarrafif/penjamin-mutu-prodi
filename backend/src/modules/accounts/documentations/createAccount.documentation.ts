import type { OpenAPIV3 } from "openapi-types";

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

export const createAccountDocumentation: OpenAPIV3.OperationObject = {
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
};
