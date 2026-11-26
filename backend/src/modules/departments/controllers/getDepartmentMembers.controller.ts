import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getDepartmentMembersSchema } from "../schemas/getDepartmentMembers.schema";
import type { GetDepartmentMembersService } from "../services/getDepartmentMembers.service";
export class GetDepartmentMembersController {
  constructor(private readonly service: GetDepartmentMembersService) {}
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
      const parsed = getDepartmentMembersSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const members = await this.service.execute(
        parsed.data,
        accountId,
        accountRole,
      );
      return successResponse(
        { set },
        {
          title: "Department members retrieved",
          description:
            "The department membership records were retrieved successfully.",
          data: members as unknown[],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
