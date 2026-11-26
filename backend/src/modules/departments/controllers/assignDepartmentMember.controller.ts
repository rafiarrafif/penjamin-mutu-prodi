import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { assignDepartmentMemberSchema } from "../schemas/assignDepartmentMember.schema";
import type { AssignDepartmentMemberService } from "../services/assignDepartmentMember.service";
export class AssignDepartmentMemberController {
  constructor(private readonly service: AssignDepartmentMemberService) {}
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
      const parsed = assignDepartmentMemberSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const record = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          status: 201,
          title: "Department member assigned",
          description: "The lecturer membership was created successfully.",
          data: [record],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
