import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteDataCategorySchema } from "../schemas/deleteDataCategory.schema";
import type { DeleteDataCategoryService } from "../services/deleteDataCategory.service";

interface DeleteDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  sessionId: string;
}

export class DeleteDataCategoryController {
  constructor(private readonly service: DeleteDataCategoryService) {}

  async handle({
    body,
    set,
    accountId,
    sessionId,
  }: DeleteDataCategoryControllerContext) {
    try {
      const parsedBody = deleteDataCategorySchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const category = await this.service.execute(
        parsedBody.data,
        accountId,
        sessionId,
      );

      return successResponse(
        { set },
        {
          status: 200,
          title: "Data category deleted",
          description: "The data category was soft deleted successfully.",
          data: [category],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
