import type { OpenAPIV3 } from "openapi-types";
export const createPeriodDocumentation: OpenAPIV3.OperationObject = {
  summary: "Create period",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: [
            "operationType",
            "frequency_code",
            "label",
            "year",
            "start_date",
            "end_date",
          ],
          properties: {
            operationType: { type: "string", enum: ["CREATE"] },
            frequency_code: { type: "string", maxLength: 32 },
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
    201: { description: "Period created." },
    404: { description: "Frequency not found." },
  },
};
