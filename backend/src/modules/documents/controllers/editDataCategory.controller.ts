import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editDataCategory } from "../services/editDataCategory.service";
import { editDataCategorySchema } from "../schemas/editDataCategory.schema";

interface EditDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  sessionId: string;
}

export async function editDataCategoryController({
  body,
  set,
  accountId,
  sessionId,
}: EditDataCategoryControllerContext) {
  try {
    const parsedBody = editDataCategorySchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const category = await editDataCategory(
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
