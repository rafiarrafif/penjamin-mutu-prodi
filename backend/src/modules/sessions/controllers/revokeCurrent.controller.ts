import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { revokeCurrentSchema } from "../schemas/revokeCurrent.schema";
import type { RevokeCurrentService } from "../services/revokeCurrent.service";

interface RevokeCurrentControllerContext {
  body: unknown;
  set: { status?: number | string };
  sessionId: string;
}

export class RevokeCurrentController {
  constructor(private readonly service: RevokeCurrentService) {}

  async handle({ body, set, sessionId }: RevokeCurrentControllerContext) {
    try {
      const parsedBody = revokeCurrentSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      await this.service.execute(sessionId);

      return successResponse(
        { set },
        {
          status: 200,
          title: "Session revoked",
          description: "Your current session has been revoked successfully.",
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
