import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteFrequencySchema } from "../schemas/deleteFrequency.schema";
import type { DeleteFrequencyService } from "../services/deleteFrequency.service";
export class DeleteFrequencyController {
  constructor(private readonly service: DeleteFrequencyService) {}
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
      const parsed = deleteFrequencySchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const deleted = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Frequency deleted",
          description:
            "The collection frequency was soft-deleted successfully.",
          data: [deleted],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
