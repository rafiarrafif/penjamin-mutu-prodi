import type { Context } from "elysia";
import { errorResponse, successResponse } from "../../../helper/response";
import { handleError } from "../../../helper/errorHandler";
import {
  googleCallbackQuerySchema,
  googleUserProfileSchema,
} from "../schemas/googleAuthorizationCallback.schema";
import { getClientIpAddress } from "../../../helper/clientIp";
import type { GoogleAuthorizationCallbackService } from "../services/googleAuthorizationCallback.service";

interface JwtContext {
  sign(payload: any): Promise<string>;
}

export class GoogleAuthorizationCallbackController {
  constructor(private readonly service: GoogleAuthorizationCallbackService) {}

  async handle({
    jwt,
    query,
    request,
    server,
    set,
  }: Context & { jwt: JwtContext }) {
    try {
      const parsedQuery = googleCallbackQuerySchema.safeParse(query);
      if (!parsedQuery.success) return handleError(parsedQuery.error, { set });

      const { code, state, error: providerError } = parsedQuery.data;
      if (providerError)
        return errorResponse(
          { set },
          {
            status: 400,
            title: "Google authorization denied",
            description: "Google did not authorize this login request.",
            errors: [{ field: "error", message: "Authorization was denied." }],
          },
        );

      if (!code || !state) return handleError(parsedQuery.error, { set });

      const rawProfile = await this.service.exchangeCode(code, state);
      const parsedProfile = googleUserProfileSchema.safeParse(rawProfile);

      if (!parsedProfile.success) {
        return errorResponse(
          { set },
          {
            status: 502,
            title: "Google profile unavailable",
            description:
              "Google returned a profile that could not be validated.",
            errors: [],
          },
        );
      }

      if (parsedProfile.data.email_verified !== true) {
        return errorResponse(
          { set },
          {
            status: 403,
            title: "Google email is not verified",
            description:
              "A verified Google email address is required to sign in.",
            errors: [
              { field: "email", message: "Google email is not verified." },
            ],
          },
        );
      }

      const login = await this.service.createLoginSession(
        parsedProfile.data.email,
        parsedProfile.data.sub,
        parsedProfile.data.picture ?? null,
        request.headers.get("user-agent"),
        getClientIpAddress(request, server),
      );

      if (!login) {
        return errorResponse(
          { set },
          {
            status: 403,
            title: "Account not provisioned",
            description:
              "No account is registered for the Google email address.",
            errors: [
              { field: "email", message: "No matching account exists." },
            ],
          },
        );
      }

      const account = login.account as {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      };
      const token = await jwt.sign({
        session_id: login.sessionId,
        account: {
          ...(login.account as object),
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
          deletedAt: account.deletedAt?.toISOString() ?? null,
        },
      });

      return successResponse(
        { set },
        {
          title: "Google authentication successful",
          description: "A JWT was issued for the authenticated account.",
          data: [{ token }],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
