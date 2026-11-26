import type { OpenAPIV3 } from "openapi-types";
export const getDepartmentMembersDocumentation: OpenAPIV3.OperationObject = {
  summary: "List department members",
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
            include_ended: { type: "boolean", default: false },
          },
        },
      },
    },
  },
  responses: {
    200: { description: "Membership records retrieved." },
    403: { description: "Lecturer is not an active member." },
    404: { description: "Department not found." },
  },
};
