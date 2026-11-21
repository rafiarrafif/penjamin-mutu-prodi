import type { OpenAPIV3 } from "openapi-types";

export const deleteDataCategoryDocumentation: OpenAPIV3.OperationObject = {
  summary: "Soft delete a data category",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "category_id"],
          properties: {
            operationType: { type: "string", enum: ["DELETE"] },
            category_id: { type: "string" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Data category soft deleted." },
    401: { description: "Authentication required." },
    403: { description: "Admin role or higher required." },
    404: { description: "Data category not found." },
  },
};
