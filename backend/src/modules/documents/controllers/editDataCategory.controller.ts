import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editDataCategorySchema } from "../schemas/editDataCategory.schema";
import type { EditDataCategoryService } from "../services/editDataCategory.service";

interface EditDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  sessionId: string;
}

export class EditDataCategoryController {
  constructor(private readonly service: EditDataCategoryService) {}

  async handle({
    body,
    set,
    accountId,
    sessionId,
  }: EditDataCategoryControllerContext) {
    try {
      const parsedBody = editDataCategorySchema.safeParse(body);
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
          title: "Data category updated",
          description: "The data category was updated successfully.",
          data: [category],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
