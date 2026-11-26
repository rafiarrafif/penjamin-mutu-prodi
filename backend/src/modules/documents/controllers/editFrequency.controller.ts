import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editFrequencySchema } from "../schemas/editFrequency.schema";
import type { EditFrequencyService } from "../services/editFrequency.service";
export class EditFrequencyController {
  constructor(private readonly service: EditFrequencyService) {}
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
      const parsed = editFrequencySchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const frequency = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Frequency updated",
          description: "The collection frequency was updated successfully.",
          data: [frequency],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
