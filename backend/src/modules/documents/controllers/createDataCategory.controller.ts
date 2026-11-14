import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createDataCategory } from "../services/createDataCategory.service";
import { createDataCategorySchema } from "../schemas/createDataCategory.schema";

interface CreateDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export async function createDataCategoryController({
  body,
  set,
}: CreateDataCategoryControllerContext) {
  try {
    const parsedBody = createDataCategorySchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const category = await createDataCategory(parsedBody.data);

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
