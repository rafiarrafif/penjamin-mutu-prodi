import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { approvalProvisionSchema } from "../schemas/approvalProvision.schema";
import type { ApprovalProvisionService } from "../services/approvalProvision.service";

interface ApprovalProvisionControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export class ApprovalProvisionController {
  constructor(private readonly service: ApprovalProvisionService) {}

  async handle({ body, set }: ApprovalProvisionControllerContext) {
    try {
      const parsedBody = approvalProvisionSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const result = await this.service.execute(parsedBody.data);

      return successResponse(
        { set },
        {
          status: result.alreadyVerified ? 201 : 200,
          title: result.alreadyVerified
            ? "Account already verified"
            : "Account approved",
          description: result.alreadyVerified
            ? "The account was already verified and no changes were made."
            : "The account has been successfully verified and activated.",
          data: [result.account],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
