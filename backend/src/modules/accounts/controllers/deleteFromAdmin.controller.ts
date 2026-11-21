import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteFromAdminSchema } from "../schemas/deleteFromAdmin.schema";
import type { DeleteFromAdminService } from "../services/deleteFromAdmin.service";

interface DeleteFromAdminControllerContext {
  body: unknown;
  set: { status?: number | string };
}

export class DeleteFromAdminController {
  constructor(private readonly service: DeleteFromAdminService) {}

  async handle({ body, set }: DeleteFromAdminControllerContext) {
    try {
      const parsedBody = deleteFromAdminSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const deletedAccount = await this.service.execute(parsedBody.data);

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
}
