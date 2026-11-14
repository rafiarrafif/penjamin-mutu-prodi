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

export const approvalProvisionDocumentation: OpenAPIV3.OperationObject = {
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
      description: "Account was already verified and no changes were made.",
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
};
