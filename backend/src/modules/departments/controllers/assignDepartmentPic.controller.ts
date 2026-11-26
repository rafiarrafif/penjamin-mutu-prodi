import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { assignDepartmentPicSchema } from "../schemas/assignDepartmentPic.schema";
import type { AssignDepartmentPicService } from "../services/assignDepartmentPic.service";
export class AssignDepartmentPicController {
  constructor(private readonly service: AssignDepartmentPicService) {}
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
      const parsed = assignDepartmentPicSchema.safeParse(body);
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
          title: "PIC assignment created",
          description: "The department was assigned as PIC successfully.",
          data: [record],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
