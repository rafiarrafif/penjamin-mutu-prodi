import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getSpecificDepartmentSchema } from "../schemas/getSpecificDepartment.schema";
import type { GetSpecificDepartmentService } from "../services/getSpecificDepartment.service";
export class GetSpecificDepartmentController {
  constructor(private readonly service: GetSpecificDepartmentService) {}
  async handle({
    body,
    set,
    accountId,
    accountRole,
  }: {
    body: unknown;
    set: { status?: number | string };
    accountId: string;
    accountRole: string;
  }) {
    try {
      const parsed = getSpecificDepartmentSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const department = await this.service.execute(
        parsed.data.department_id,
        accountId,
        accountRole,
      );
      return successResponse(
        { set },
        {
          title: "Department found",
          description: "The department was retrieved successfully.",
          data: [department],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
