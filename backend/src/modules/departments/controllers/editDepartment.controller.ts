import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editDepartmentSchema } from "../schemas/editDepartment.schema";
import type { EditDepartmentService } from "../services/editDepartment.service";
export class EditDepartmentController {
  constructor(private readonly service: EditDepartmentService) {}
  async handle({
    body,
    set,
    accountId,
    sessionId,
  }: {
    body: unknown;
    set: { status?: number | string };
    accountId: string;
    sessionId: string;
  }) {
    try {
      const parsed = editDepartmentSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const department = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Department updated",
          description: "The department was updated successfully.",
          data: [department],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
