import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllDepartmentsSchema } from "../schemas/getAllDepartments.schema";
import type { GetAllDepartmentsService } from "../services/getAllDepartments.service";
export class GetAllDepartmentsController {
  constructor(private readonly service: GetAllDepartmentsService) {}
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
      const parsed = getAllDepartmentsSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const departments = await this.service.execute(accountId, accountRole);
      return successResponse(
        { set },
        {
          title: "Departments retrieved",
          description: "The departments were retrieved successfully.",
          data: departments as unknown[],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
