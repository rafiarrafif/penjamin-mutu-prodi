import type { OpenAPIV3 } from "openapi-types";
export const editDepartmentDocumentation: OpenAPIV3.OperationObject = {
  summary: "Edit department",
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
            operationType: { type: "string", enum: ["UPDATE"] },
            department_id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 115 },
            description: { type: "string", nullable: true, maxLength: 255 },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Department updated." },
    403: { description: "Admin or director required." },
    404: { description: "Department not found." },
  },
};
