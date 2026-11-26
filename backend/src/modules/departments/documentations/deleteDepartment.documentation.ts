import type { OpenAPIV3 } from "openapi-types";
export const deleteDepartmentDocumentation: OpenAPIV3.OperationObject = {
  summary: "Delete department",
  tags: ["Departments"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "department_id"],
          properties: {
            operationType: { type: "string", enum: ["DELETE"] },
            department_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Department soft deleted." },
    409: { description: "Department has active PIC assignments." },
    404: { description: "Department not found." },
  },
};
