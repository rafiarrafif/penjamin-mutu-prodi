import type { OpenAPIV3 } from "openapi-types";
export const deleteFrequencyDocumentation: OpenAPIV3.OperationObject = {
  summary: "Delete frequency",
  tags: ["Documents"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "code"],
          properties: {
            operationType: { type: "string", enum: ["DELETE"] },
            code: { type: "string", maxLength: 32 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Frequency soft-deleted." },
    404: { description: "Frequency not found." },
    409: { description: "Frequency is still referenced." },
  },
};
