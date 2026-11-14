import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { selfEdit } from "../services/selfEdit.service";
import { selfEditSchema } from "../schemas/selfEdit.schema";

interface SelfEditControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountId: string;
  accountRole: string;
}

export async function selfEditController({
  body,
  set,
  accountId,
  accountRole,
}: SelfEditControllerContext) {
  try {
    const parsedBody = selfEditSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const updatedAccount = await selfEdit(accountId, parsedBody.data, accountRole);

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
