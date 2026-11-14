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

export const createDataCategoryDocumentation: OpenAPIV3.OperationObject = {
  summary: "Create a data category",
  description:
    "Create a data category. Its URL-safe slug is generated from its name, with a numeric suffix added when needed to avoid an existing slug.",
  tags: ["Documents"],
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
            name: { type: "string", maxLength: 250 },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Data category created and inserted data returned.",
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
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "name", "slug"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string", maxLength: 255 },
                    slug: { type: "string", maxLength: 255 },
                  },
                },
              },
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
      description: "The authenticated account is below admin role.",
      content: { "application/json": { schema: errorEnvelope } },
    },
  },
};
