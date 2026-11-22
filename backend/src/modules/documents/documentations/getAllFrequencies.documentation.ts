import type { OpenAPIV3 } from "openapi-types";
export const getAllFrequenciesDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get all frequencies",
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
    200: { description: "Frequencies retrieved." },
    401: { description: "Authentication required." },
  },
};
