import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createNewDepartment } from "../services/createNewDepartment.service";
import { createNewDepartmentSchema } from "../schemas/createNewDepartment.schema";

interface CreateDepartmentControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
}

export async function createNewDepartmentController({
  body,
  set,
  accountId,
}: CreateDepartmentControllerContext) {
  try {
    const parsedBody = createNewDepartmentSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const department = await createNewDepartment(parsedBody.data, accountId);

    return successResponse(
      { set },
      {
        status: 201,
        title: "Department created",
        description: "The department was added to the system successfully.",
        data: [department],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
