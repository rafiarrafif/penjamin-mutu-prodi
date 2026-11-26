import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createPeriodSchema } from "../schemas/createPeriod.schema";
import type { CreatePeriodService } from "../services/createPeriod.service";
export class CreatePeriodController {
  constructor(private readonly service: CreatePeriodService) {}
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
      const parsed = createPeriodSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const period = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          status: 201,
          title: "Period created",
          description: "The collection period was created successfully.",
          data: [period],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
