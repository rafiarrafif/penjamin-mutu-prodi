import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteDepartmentSchema } from "../schemas/deleteDepartment.schema";
import type { DeleteDepartmentService } from "../services/deleteDepartment.service";
export class DeleteDepartmentController {
  constructor(private readonly service: DeleteDepartmentService) {}
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
      const parsed = deleteDepartmentSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      await this.service.execute(parsed.data, accountId, sessionId);
      return successResponse(
        { set },
        {
          title: "Department deleted",
          description: "The department was soft deleted successfully.",
          data: [{ department_id: parsed.data.department_id }],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
