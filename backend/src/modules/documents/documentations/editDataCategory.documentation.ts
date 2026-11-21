import type { OpenAPIV3 } from "openapi-types";

export const editDataCategoryDocumentation: OpenAPIV3.OperationObject = {
  summary: "Edit a data category",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "category_id", "name"],
          properties: {
            operationType: { type: "string", enum: ["UPDATE"] },
            category_id: { type: "string" },
            name: { type: "string", maxLength: 255 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Data category updated." },
    401: { description: "Authentication required." },
    403: { description: "Admin role or higher required." },
    404: { description: "Data category not found." },
  },
};
