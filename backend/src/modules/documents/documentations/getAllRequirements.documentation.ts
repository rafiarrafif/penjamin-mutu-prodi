import type { OpenAPIV3 } from "openapi-types";
export const getAllRequirementsDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get all data requirements",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: false,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType"],
          properties: {
            operationType: { type: "string", enum: ["READ"] },
            category_id: { type: "string", format: "uuid" },
            frequency_code: { type: "string" },
          },
        },
      },
    },
  },
  responses: { 200: { description: "Requirements retrieved." } },
};
