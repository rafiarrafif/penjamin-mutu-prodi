import type { OpenAPIV3 } from "openapi-types";
export const getSpecificDepartmentDocumentation: OpenAPIV3.OperationObject = {
  summary: "Get department details",
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
            operationType: { type: "string", enum: ["READ"] },
            department_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Department retrieved." },
    403: { description: "Lecturer is not an active member." },
    404: { description: "Department not found." },
  },
};
