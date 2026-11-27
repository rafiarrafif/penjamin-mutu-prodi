import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getCurrentSessionSchema } from "../schemas/getCurrentSession.schema";
import type { GetCurrentSessionService } from "../services/getCurrentSession.service";

interface GetCurrentSessionControllerContext {
  body: unknown;
  set: { status?: number | string };
  jwtPayload: Record<string, unknown>;
}

export class GetCurrentSessionController {
  constructor(private readonly service: GetCurrentSessionService) {}

  async handle({ body, set, jwtPayload }: GetCurrentSessionControllerContext) {
    try {
      const parsedBody = getCurrentSessionSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const session = await Promise.resolve(this.service.execute(jwtPayload));

      return successResponse(
        { set },
        {
          status: 200,
          title: "Current session retrieved",
          description:
            "The authenticated session status and JWT payload were retrieved successfully.",
          data: [session],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
