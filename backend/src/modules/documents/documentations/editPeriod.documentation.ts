import type { OpenAPIV3 } from "openapi-types";
export const editPeriodDocumentation: OpenAPIV3.OperationObject = {
  summary: "Edit period",
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
            operationType: { type: "string", enum: ["UPDATE"] },
            period_id: { type: "string", format: "uuid" },
            label: { type: "string", maxLength: 64 },
            year: { type: "integer", minimum: 2000, maximum: 2100 },
            month: { type: "integer", minimum: 1, maximum: 12, nullable: true },
            semester: { type: "integer", enum: [1, 2], nullable: true },
            start_date: { type: "string", format: "date" },
            end_date: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Period updated." },
    404: { description: "Period not found." },
  },
};
