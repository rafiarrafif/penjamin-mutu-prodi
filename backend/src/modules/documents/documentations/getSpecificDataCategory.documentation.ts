import type { OpenAPIV3 } from "openapi-types";

export const getSpecificDataCategoryDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get a data category with requirements",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "id"],
          properties: {
            operationType: { type: "string", enum: ["READ"] },
            id: { type: "string", maxLength: 255 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Data category and requirements retrieved." },
    404: { description: "Data category not found." },
  },
};
