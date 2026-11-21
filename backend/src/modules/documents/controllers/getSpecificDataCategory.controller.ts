import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getSpecificDataCategory } from "../services/getSpecificDataCategory.service";
import { getSpecificDataCategorySchema } from "../schemas/getSpecificDataCategory.schema";

interface GetSpecificDataCategoryControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export async function getSpecificDataCategoryController({
  body,
  set,
}: GetSpecificDataCategoryControllerContext) {
  try {
    const parsedBody = getSpecificDataCategorySchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const category = await getSpecificDataCategory(parsedBody.data);

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
