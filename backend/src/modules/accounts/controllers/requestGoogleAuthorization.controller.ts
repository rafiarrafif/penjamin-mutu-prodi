import type { Context } from "elysia";
import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { requestGoogleAuthorization } from "../services/requestGoogleAuthorization.service";
import { googleAuthorizationUrlSchema } from "../schemas/requestGoogleAuthorization.schema";

export async function requestGoogleAuthorizationController({ set }: Context) {
  try {
    const result = googleAuthorizationUrlSchema.parse(
      await requestGoogleAuthorization(),
    );

    return successResponse(
      { set },
      {
        title: "Google login URL created",
        description: "Continue to Google to authenticate your account.",
        data: [{ authorizationUrl: result.authorizationUrl }],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
