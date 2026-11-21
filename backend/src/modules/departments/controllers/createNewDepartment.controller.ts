import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createNewDepartmentSchema } from "../schemas/createNewDepartment.schema";
import type { CreateNewDepartmentService } from "../services/createNewDepartment.service";

interface CreateDepartmentControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
}

export class CreateNewDepartmentController {
  constructor(private readonly service: CreateNewDepartmentService) {}

  async handle({ body, set, accountId }: CreateDepartmentControllerContext) {
    try {
      const parsedBody = createNewDepartmentSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const department = await this.service.execute(parsedBody.data, accountId);

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
}
