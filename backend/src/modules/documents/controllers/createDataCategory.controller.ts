import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createDataCategorySchema } from "../schemas/createDataCategory.schema";
import type { CreateDataCategoryService } from "../services/createDataCategory.service";

interface CreateDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  sessionId: string;
}

export class CreateDataCategoryController {
  constructor(private readonly service: CreateDataCategoryService) {}

  async handle({
    body,
    set,
    accountId,
    sessionId,
  }: CreateDataCategoryControllerContext) {
    try {
      const parsedBody = createDataCategorySchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const category = await this.service.execute(
        parsedBody.data,
        accountId,
        sessionId,
      );

      return successResponse(
        { set },
        {
          status: 201,
          title: "Category created",
          description: "The data category was added successfully.",
          data: [category],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
