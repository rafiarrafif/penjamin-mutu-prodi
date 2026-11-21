import type { Context } from "elysia";
import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { googleAuthorizationUrlSchema } from "../schemas/requestGoogleAuthorization.schema";
import type { RequestGoogleAuthorizationService } from "../services/requestGoogleAuthorization.service";

export class RequestGoogleAuthorizationController {
  constructor(private readonly service: RequestGoogleAuthorizationService) {}

  async handle({ set }: Context) {
    try {
      const result = googleAuthorizationUrlSchema.parse(
        await this.service.execute(),
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
}
