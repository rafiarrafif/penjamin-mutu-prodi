import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllDataCategoriesSchema } from "../schemas/getAllDataCategories.schema";
import { GetAllDataCategoriesService } from "../services/getAllDataCategories.service";

export interface GetAllDataCategoriesControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export class GetAllDataCategoriesController {
  constructor(private readonly service: GetAllDataCategoriesService) {}

  async handle({ body, set }: GetAllDataCategoriesControllerContext) {
    try {
      const parsedBody = getAllDataCategoriesSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const categories = await this.service.execute(parsedBody.data);

      return successResponse(
        { set },
        {
          status: 200,
          title: "Data categories retrieved",
          description: "The data category list was retrieved successfully.",
          data: categories,
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
