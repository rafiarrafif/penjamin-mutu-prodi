import type { OpenAPIV3 } from "openapi-types";
export const getAllDepartmentsDocumentation: OpenAPIV3.OperationObject = {
  summary: "List departments",
  tags: ["Departments"],
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
    200: { description: "Departments retrieved." },
    401: { description: "Authentication required." },
  },
};
