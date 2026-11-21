import type { Context } from "elysia";
import { errorResponse } from "../helper/response";
import type { FindActiveSessionService } from "../modules/sessions/services/findActiveSession.service";

const ROLE_LEVEL: Record<string, number> = {
  lecturer: 0,
  verifier: 1,
  verificator: 1,
  admin: 2,
  director: 3,
};

export function requireRoleMiddleware(
  requiredRole: string,
  activeSessionService: FindActiveSessionService,
) {
  const requiredLevel =
    ROLE_LEVEL[requiredRole.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;

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

    const session = await activeSessionService.execute(claims.session_id);
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
      (ROLE_LEVEL[session.account.role.toLowerCase()] ?? -1) < requiredLevel
    ) {
      return status(
        403,
        errorResponse(
          { set },
          {
            status: 403,
            title: "Insufficient permissions",
            description: `This operation requires the ${requiredRole} role or higher.`,
            errors: [
              {
                field: "role",
                message: `The ${requiredRole} role or higher is required.`,
              },
            ],
          },
        ),
      );
    }

    return {
      accountId: session.account.id,
      accountRole: session.account.role,
      sessionId: claims.session_id,
    };
  };
}
