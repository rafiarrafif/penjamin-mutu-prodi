import type { OpenAPIV3 } from "openapi-types";
export const getSpecificRequirementDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get data requirement",
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
            operationType: { type: "string", enum: ["READ"] },
            requirement_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Requirement retrieved." },
    404: { description: "Requirement not found." },
  },
};
