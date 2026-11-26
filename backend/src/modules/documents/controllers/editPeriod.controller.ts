import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editPeriodSchema } from "../schemas/editPeriod.schema";
import type { EditPeriodService } from "../services/editPeriod.service";
export class EditPeriodController {
  constructor(private readonly service: EditPeriodService) {}
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
      const parsed = editPeriodSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const period = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Period updated",
          description: "The collection period was updated successfully.",
          data: [period],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
