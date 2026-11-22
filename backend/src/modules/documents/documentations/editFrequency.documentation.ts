import type { OpenAPIV3 } from "openapi-types";
export const editFrequencyDocumentation: OpenAPIV3.OperationObject = {
  summary: "Edit frequency",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "code", "label"],
          properties: {
            operationType: { type: "string", enum: ["UPDATE"] },
            code: { type: "string", maxLength: 32 },
            label: { type: "string", maxLength: 225 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Frequency updated." },
    404: { description: "Frequency not found." },
  },
};
