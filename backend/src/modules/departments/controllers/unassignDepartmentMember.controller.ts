import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { unassignDepartmentMemberSchema } from "../schemas/unassignDepartmentMember.schema";
import type { UnassignDepartmentMemberService } from "../services/unassignDepartmentMember.service";
export class UnassignDepartmentMemberController {
  constructor(private readonly service: UnassignDepartmentMemberService) {}
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
      const parsed = unassignDepartmentMemberSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const record = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Department member unassigned",
          description: "The membership was ended successfully.",
          data: [record],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
