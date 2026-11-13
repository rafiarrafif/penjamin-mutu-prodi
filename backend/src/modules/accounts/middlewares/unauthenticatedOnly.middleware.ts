import type { Context } from "elysia";
import { errorResponse } from "../../../helper/response";

export function unauthenticatedOnlyMiddleware({ request, set }: Context) {
  if (!new URL(request.url).pathname.startsWith("/accounts/auth/")) return;

  const authorization = request.headers.get("authorization");
  const hasBearerToken = /^Bearer\s+\S+$/i.test(authorization?.trim() ?? "");

  if (!hasBearerToken) return;

  return errorResponse(
    { set },
    {
      status: 401,
      title: "Already authenticated",
      description: "This endpoint is only available to logged-out users.",
      errors: [
        {
          field: "authorization",
          message: "Remove the bearer token to continue.",
        },
      ],
    },
  );
}
