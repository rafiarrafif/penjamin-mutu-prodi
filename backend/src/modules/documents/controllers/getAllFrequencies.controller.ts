import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllFrequenciesSchema } from "../schemas/getAllFrequencies.schema";
import type { GetAllFrequenciesService } from "../services/getAllFrequencies.service";
export class GetAllFrequenciesController {
  constructor(private readonly service: GetAllFrequenciesService) {}
  async handle({
    body,
    set,
  }: {
    body: unknown;
    set: { status?: number | string };
  }) {
    try {
      const parsed = getAllFrequenciesSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const frequencies = await this.service.execute();
      return successResponse(
        { set },
        {
          title: "Frequencies retrieved",
          description:
            "The collection frequencies were retrieved successfully.",
          data: frequencies,
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
