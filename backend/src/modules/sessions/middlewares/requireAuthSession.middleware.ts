import type { Context } from "elysia";
import { errorResponse } from "../../../helper/response";

export async function requireAuthSessionMiddleware({
  request,
  set,
  status,
  jwt,
}: Context & {
  jwt: {
    verify: (token?: string) => Promise<Record<string, unknown> | false>;
  };
}) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return status(
      401,
      errorResponse(
        { set },
        {
          status: 401,
          title: "Authentication required",
          description: "Sign in with an active bearer token to continue.",
          errors: [
            {
              field: "authorization",
              message: "A valid bearer token is required.",
            },
          ],
        },
      ),
    );
  }

  const claims = await jwt.verify(match[1]);
  if (!claims || typeof claims.session_id !== "string") {
    return status(
      401,
      errorResponse(
        { set },
        {
          status: 401,
          title: "Invalid token",
          description:
            "The bearer token is invalid or does not contain required claims.",
          errors: [
            {
              field: "authorization",
              message: "A valid signed JWT is required.",
            },
          ],
        },
      ),
    );
  }

  return {
    sessionId: claims.session_id,
  };
}
