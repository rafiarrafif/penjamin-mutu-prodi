import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createDepartment } from "../services/departments.service";
import { createDepartmentSchema } from "../schemas/departments.schema";

interface CreateDepartmentControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
}

export async function createDepartmentController({
  body,
  set,
  accountId,
}: CreateDepartmentControllerContext) {
  try {
    const parsedBody = createDepartmentSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const department = await createDepartment(parsedBody.data, accountId);

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
