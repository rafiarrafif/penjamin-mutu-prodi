import type { Context } from "elysia";
import { errorResponse } from "../../../helper/response";
import type { FindActiveSessionService } from "../services/findActiveSession.service";

export function requireAuthSessionMiddleware(
  activeSessionService: FindActiveSessionService,
) {
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

    const verified = await jwt.verify(match[1]).catch(() => false);
    const claims =
      typeof verified === "object" && verified !== null ? verified : false;

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
    const accountId = (claims.account as Record<string, unknown>).id;

    if (
      !session ||
      session.account.deletedAt !== null ||
      session.account.id !== accountId
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

    const knownRoles = new Set([
      "lecturer",
      "verifier",
      "verificator",
      "admin",
      "director",
    ]);
    if (!knownRoles.has(session.account.role.toLowerCase())) {
      return status(
        401,
        errorResponse(
          { set },
          {
            status: 401,
            title: "Invalid account",
            description:
              "The authenticated account does not have a recognized role.",
            errors: [
              {
                field: "role",
                message: "A recognized account role is required.",
              },
            ],
          },
        ),
      );
    }

    return {
      sessionId: claims.session_id,
      jwtPayload: claims,
    };
  };
}
