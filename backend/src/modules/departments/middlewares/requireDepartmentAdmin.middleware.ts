import type { Context } from "elysia";
import { errorResponse } from "../../../helper/response";
import { findActiveSession } from "../../sessions/services/findActiveSession.service";

const ROLE_LEVEL: Record<string, number> = {
  lecturer: 0,
  verifier: 1,
  verificator: 1,
  admin: 2,
  director: 3,
};

export function requireDepartmentAdminMiddleware() {
  return async ({
    request,
    set,
    status,
    jwt,
  }: Context & {
    jwt: {
      verify: (token?: string) => Promise<Record<string, unknown> | false>;
    };
  }) => {
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
    if (
      !claims ||
      typeof claims.session_id !== "string" ||
      typeof claims.account !== "object" ||
      claims.account === null ||
      typeof (claims.account as Record<string, unknown>).id !== "string"
    ) {
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

    const session = await findActiveSession(claims.session_id);
    if (
      !session ||
      session.account.id !== (claims.account as Record<string, unknown>).id
    ) {
      return status(
        401,
        errorResponse(
          { set },
          {
            status: 401,
            title: "Invalid session",
            description:
              "The token session is missing, revoked, or does not match the account.",
            errors: [
              {
                field: "authorization",
                message: "The session is invalid or revoked.",
              },
            ],
          },
        ),
      );
    }

    if (
      (ROLE_LEVEL[session.account.role.toLowerCase()] ?? -1) < ROLE_LEVEL.admin
    ) {
      return status(
        403,
        errorResponse(
          { set },
          {
            status: 403,
            title: "Insufficient permissions",
            description:
              "Creating departments requires the admin role or higher.",
            errors: [
              {
                field: "role",
                message: "Admin or director permissions are required.",
              },
            ],
          },
        ),
      );
    }

    return { accountId: session.account.id };
  };
}
