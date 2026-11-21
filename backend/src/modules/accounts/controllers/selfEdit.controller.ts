import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { selfEditSchema } from "../schemas/selfEdit.schema";
import type { SelfEditService } from "../services/selfEdit.service";

interface SelfEditControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  accountRole: string;
}

export class SelfEditController {
  constructor(private readonly service: SelfEditService) {}

  async handle({
    body,
    set,
    accountId,
    accountRole,
  }: SelfEditControllerContext) {
    try {
      const parsedBody = selfEditSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const updatedAccount = await this.service.execute(
        accountId,
        parsedBody.data,
        accountRole,
      );

      return successResponse(
        { set },
        {
          status: 200,
          title: "Account updated",
          description: "Your account was updated successfully.",
          data: [updatedAccount],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
