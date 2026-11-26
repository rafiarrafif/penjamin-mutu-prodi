import type { OpenAPIV3 } from "openapi-types";
export const assignDepartmentMemberDocumentation: OpenAPIV3.OperationObject = {
  summary: "Assign department member",
  tags: ["Departments"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "department_id", "account_id"],
          properties: {
            operationType: { type: "string", enum: ["CREATE"] },
            department_id: { type: "string", format: "uuid" },
            account_id: { type: "string", format: "uuid" },
            start_date: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  responses: {
    201: { description: "Membership created." },
    404: { description: "Department or lecturer not found." },
    409: { description: "Active membership already exists." },
  },
};
