import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllDataCategories } from "../services/getAllDataCategories.service";
import { getAllDataCategoriesSchema } from "../schemas/getAllDataCategories.schema";

interface GetAllDataCategoriesControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export async function getAllDataCategoriesController({
  body,
  set,
}: GetAllDataCategoriesControllerContext) {
  try {
    const parsedBody = getAllDataCategoriesSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const categories = await getAllDataCategories(parsedBody.data);

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
