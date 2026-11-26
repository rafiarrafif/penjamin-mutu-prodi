import type { OpenAPIV3 } from "openapi-types";
export const unassignDepartmentMemberDocumentation: OpenAPIV3.OperationObject =
  {
    summary: "Unassign department member",
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
              operationType: { type: "string", enum: ["UPDATE"] },
              department_id: { type: "string", format: "uuid" },
              account_id: { type: "string", format: "uuid" },
              end_date: { type: "string", format: "date" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "Membership ended." },
      404: { description: "Active membership not found." },
    },
  };
