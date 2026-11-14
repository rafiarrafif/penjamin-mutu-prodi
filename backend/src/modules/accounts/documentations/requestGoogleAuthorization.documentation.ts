import type { OpenAPIV3 } from "openapi-types";

const successEnvelope: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "status", "message", "data"],
  properties: {
    success: { type: "boolean", enum: [true] },
    status: { type: "integer", enum: [200] },
    message: {
      type: "object",
      required: ["title", "description"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
    data: { type: "array", items: { type: "object" } },
  },
};

const errorEnvelope: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "status", "message", "errors"],
  properties: {
    success: { type: "boolean", enum: [false] },
    status: { type: "integer" },
    message: {
      type: "object",
      required: ["title", "description"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
    errors: { type: "array", items: {} },
  },
};

export const requestGoogleAuthorizationDocumentation: OpenAPIV3.OperationObject =
  {
    summary: "Request Google login URL",
    description:
      "Create a PKCE-protected Google authorization URL and store the verifier for the callback.",
    tags: ["Google OAuth"],
    responses: {
      200: {
        description: "Authorization URL created.",
        content: {
          "application/json": {
            schema: {
              ...successEnvelope,
              properties: {
                ...successEnvelope.properties,
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["authorizationUrl"],
                    properties: {
                      authorizationUrl: { type: "string", format: "uri" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      500: {
        description: "OAuth or Redis service could not be initialized.",
        content: { "application/json": { schema: errorEnvelope } },
      },
      401: {
        description: "This endpoint is only available to logged-out users.",
        content: { "application/json": { schema: errorEnvelope } },
      },
    },
  };
