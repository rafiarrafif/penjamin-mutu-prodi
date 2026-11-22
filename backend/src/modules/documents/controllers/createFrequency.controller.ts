import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createFrequencySchema } from "../schemas/createFrequency.schema";
import type { CreateFrequencyService } from "../services/createFrequency.service";
export class CreateFrequencyController {
  constructor(private readonly service: CreateFrequencyService) {}
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
      const parsed = createFrequencySchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const frequency = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          status: 201,
          title: "Frequency created",
          description: "The collection frequency was created successfully.",
          data: [frequency],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
