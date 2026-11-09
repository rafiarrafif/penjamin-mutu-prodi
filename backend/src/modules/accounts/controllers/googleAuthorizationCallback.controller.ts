import type { Context } from "elysia";
import { errorResponse, successResponse } from "../../../helper/response";
import { handleError } from "../../../helper/errorHandler";
import {
  createGoogleLoginSession,
  exchangeGoogleAuthorizationCode,
} from "../services/googleAuthorizationCallback.service";
import {
  googleCallbackQuerySchema,
  googleUserProfileSchema,
} from "../schemas/googleAuthorizationCallback.schema";
import { getClientIpAddress } from "../../../helper/clientIp";

export async function googleAuthorizationCallbackController({
  query,
  request,
  server,
  set,
}: Context) {
  try {
    const parsedQuery = googleCallbackQuerySchema.safeParse(query);
    if (!parsedQuery.success) return handleError(parsedQuery.error, { set });

    const { code, state, error: providerError } = parsedQuery.data;
    if (providerError) {
      return errorResponse(
        { set },
        {
          status: 400,
          title: "Google authorization denied",
          description: "Google did not authorize this login request.",
          errors: [{ field: "error", message: "Authorization was denied." }],
        },
      );
    }

    if (!code || !state) return handleError(parsedQuery.error, { set });

    const rawProfile = await exchangeGoogleAuthorizationCode(code, state);
    const parsedProfile = googleUserProfileSchema.safeParse(rawProfile);

    if (!parsedProfile.success) {
      return errorResponse(
        { set },
        {
          status: 502,
          title: "Google profile unavailable",
          description: "Google returned a profile that could not be validated.",
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

    const session = await createGoogleLoginSession(
      parsedProfile.data.email,
      parsedProfile.data.sub,
      parsedProfile.data.picture ?? null,
      request.headers.get("user-agent"),
      getClientIpAddress(request, server),
    );

    if (!session) {
      return errorResponse(
        { set },
        {
          status: 403,
          title: "Account not provisioned",
          description: "No account is registered for the Google email address.",
          errors: [{ field: "email", message: "No matching account exists." }],
        },
      );
    }

    return successResponse(
      { set },
      {
        title: "Google authentication successful",
        description: "A session was created for the existing account.",
        data: [session],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
