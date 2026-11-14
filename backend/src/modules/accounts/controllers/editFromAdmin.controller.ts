import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editFromAdmin } from "../services/editFromAdmin.service";
import { editFromAdminSchema } from "../schemas/editFromAdmin.schema";

interface EditFromAdminControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountRole: string;
}

export async function editFromAdminController({
  body,
  set,
  accountRole,
}: EditFromAdminControllerContext) {
  try {
    const parsedBody = editFromAdminSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const updatedAccount = await editFromAdmin(
      parsedBody.data,
      accountRole,
    );

    return successResponse(
      { set },
      {
        status: 200,
        title: "Account updated",
        description: "The account was updated successfully.",
        data: [updatedAccount],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
