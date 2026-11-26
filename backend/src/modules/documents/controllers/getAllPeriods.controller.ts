import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllPeriodsSchema } from "../schemas/getAllPeriods.schema";
import type { GetAllPeriodsService } from "../services/getAllPeriods.service";
export class GetAllPeriodsController {
  constructor(private readonly service: GetAllPeriodsService) {}
  async handle({
    body,
    set,
  }: {
    body: unknown;
    set: { status?: number | string };
  }) {
    try {
      const parsed = getAllPeriodsSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const periods = await this.service.execute(parsed.data);
      return successResponse(
        { set },
        {
          title: "Periods retrieved",
          description: "The collection periods were retrieved successfully.",
          data: periods,
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
