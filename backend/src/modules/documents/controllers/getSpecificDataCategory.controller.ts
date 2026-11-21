import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getSpecificDataCategorySchema } from "../schemas/getSpecificDataCategory.schema";
import type { GetSpecificDataCategoryService } from "../services/getSpecificDataCategory.service";

interface GetSpecificDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export class GetSpecificDataCategoryController {
  constructor(private readonly service: GetSpecificDataCategoryService) {}

  async handle({ body, set }: GetSpecificDataCategoryControllerContext) {
    try {
      const parsedBody = getSpecificDataCategorySchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const category = await this.service.execute(parsedBody.data);

      return successResponse(
        { set },
        {
          status: 200,
          title: "Data category found",
          description:
            "The data category and its requirements were retrieved successfully.",
          data: [category],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
