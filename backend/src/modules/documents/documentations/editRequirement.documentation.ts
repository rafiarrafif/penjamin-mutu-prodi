import type { OpenAPIV3 } from "openapi-types";
export const editRequirementDocumentation: OpenAPIV3.OperationObject = {
  summary: "Edit data requirement",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "requirement_id"],
          properties: {
            operationType: { type: "string", enum: ["UPDATE"] },
            requirement_id: { type: "string", format: "uuid" },
            category_id: { type: "string", format: "uuid" },
            frequency_code: { type: "string" },
            name: { type: "string", maxLength: 500 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Requirement updated." },
    404: { description: "Requirement, category, or frequency not found." },
    409: { description: "Frequency change conflicts with submissions." },
  },
};
