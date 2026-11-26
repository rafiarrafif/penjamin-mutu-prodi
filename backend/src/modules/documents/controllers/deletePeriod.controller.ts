import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deletePeriodSchema } from "../schemas/deletePeriod.schema";
import type { DeletePeriodService } from "../services/deletePeriod.service";
export class DeletePeriodController {
  constructor(private readonly service: DeletePeriodService) {}
  async handle({
    body,
    set,
    accountId,
    sessionId,
  }: {
    body: unknown;
    set: { status?: number | string };
    accountId: string;
    sessionId: string;
  }) {
    try {
      const parsed = deletePeriodSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const deleted = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Period deleted",
          description: "The collection period was soft-deleted successfully.",
          data: [deleted],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
