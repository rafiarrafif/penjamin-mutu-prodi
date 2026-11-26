import type { OpenAPIV3 } from "openapi-types";
export const assignDepartmentPicDocumentation: OpenAPIV3.OperationObject = {
  summary: "Assign department PIC",
  tags: ["Departments"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["operationType", "department_id", "data_requirement_id"],
          properties: {
            operationType: { type: "string", enum: ["CREATE"] },
            department_id: { type: "string", format: "uuid" },
            data_requirement_id: { type: "string", format: "uuid" },
          },
        },
      },
    },
  },
  responses: {
    201: { description: "PIC assignment created or restored." },
    409: { description: "Active PIC assignment already exists." },
    404: { description: "Department or requirement not found." },
  },
};
