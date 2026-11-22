import type { OpenAPIV3 } from "openapi-types";
export const deleteRequirementDocumentation: OpenAPIV3.OperationObject = {
  summary: "Delete data requirement",
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
            operationType: { type: "string", enum: ["DELETE"] },
            requirement_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Requirement and PIC assignments soft-deleted." },
    404: { description: "Requirement not found." },
  },
};
