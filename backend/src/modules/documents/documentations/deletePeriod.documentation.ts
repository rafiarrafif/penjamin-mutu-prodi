import type { OpenAPIV3 } from "openapi-types";
export const deletePeriodDocumentation: OpenAPIV3.OperationObject = {
  summary: "Delete period",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "period_id"],
          properties: {
            operationType: { type: "string", enum: ["DELETE"] },
            period_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Period soft-deleted." },
    404: { description: "Period not found." },
    409: { description: "Period has submissions." },
  },
};
