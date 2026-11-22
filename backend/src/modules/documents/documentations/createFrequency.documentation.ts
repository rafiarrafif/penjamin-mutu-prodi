import type { OpenAPIV3 } from "openapi-types";
export const createFrequencyDocumentation: OpenAPIV3.OperationObject = {
  summary: "Create frequency",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "code", "label"],
          properties: {
            operationType: { type: "string", enum: ["CREATE"] },
            code: {
              type: "string",
              maxLength: 32,
              pattern: "^[A-Za-z0-9_-]+$",
            },
            label: { type: "string", maxLength: 225 },
          },
        },
      },
    },
  },
  responses: {
    201: { description: "Frequency created." },
    400: { description: "Invalid request." },
    401: { description: "Authentication required." },
    403: { description: "Admin or director role required." },
    409: { description: "Frequency code already exists." },
  },
};
