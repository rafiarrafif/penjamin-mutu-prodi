import type { OpenAPIV3 } from "openapi-types";

export const getAllDataCategoriesDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get all data categories",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType"],
          properties: { operationType: { type: "string", enum: ["READ"] } },
        },
      },
    },
  },
  responses: {
    200: { description: "Data categories retrieved." },
    401: { description: "Authentication required." },
  },
};
