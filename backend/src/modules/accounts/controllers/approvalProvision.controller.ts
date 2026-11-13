import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { approvalProvision } from "../services/approvalProvision.service";
import { approvalProvisionSchema } from "../schemas/approvalProvision.schema";

interface ApprovalProvisionControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export async function approvalProvisionController({
  body,
  set,
}: ApprovalProvisionControllerContext) {
  try {
    const parsedBody = approvalProvisionSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const result = await approvalProvision(parsedBody.data);

    if (result.alreadyVerified) {
      return successResponse(
        { set },
        {
          status: 201,
          title: "Account already verified",
          description:
            "The account was already verified and no changes were made.",
          data: [result.account],
        },
      );
    }

    return successResponse(
      { set },
      {
        status: 200,
        title: "Account approved",
        description:
          "The account has been successfully verified and activated.",
        data: [result.account],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
