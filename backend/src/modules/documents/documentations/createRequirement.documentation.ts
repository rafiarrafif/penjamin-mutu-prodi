import type { OpenAPIV3 } from "openapi-types";
export const createRequirementDocumentation: OpenAPIV3.OperationObject = {
  summary: "Create data requirement",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "category_id", "frequency_code", "name"],
          properties: {
            operationType: { type: "string", enum: ["CREATE"] },
            category_id: { type: "string", format: "uuid" },
            frequency_code: { type: "string", maxLength: 32 },
            name: { type: "string", maxLength: 500 },
          },
        },
      },
    },
  },
  responses: {
    201: { description: "Requirement created." },
    404: { description: "Category or frequency not found." },
  },
};
