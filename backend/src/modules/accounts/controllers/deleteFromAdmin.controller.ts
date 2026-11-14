import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteAccountFromAdmin } from "../services/deleteFromAdmin.service";
import { deleteFromAdminSchema } from "../schemas/deleteFromAdmin.schema";

interface DeleteFromAdminControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export async function deleteFromAdminController({
  body,
  set,
}: DeleteFromAdminControllerContext) {
  try {
    const parsedBody = deleteFromAdminSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const deletedAccount = await deleteAccountFromAdmin(parsedBody.data);

    return successResponse(
      { set },
      {
        status: 200,
        title: "Account deleted",
        description: "The account was deleted successfully.",
        data: [deletedAccount],
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
