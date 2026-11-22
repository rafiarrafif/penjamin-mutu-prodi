import type { OpenAPIV3 } from "openapi-types";
export const getAllPeriodsDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get all periods",
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
            frequency_code: { type: "string" },
            year: { type: "integer", minimum: 2000, maximum: 2100 },
          },
        },
      },
    },
  },
  responses: { 200: { description: "Periods retrieved." } },
};
