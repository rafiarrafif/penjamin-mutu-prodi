import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editFromAdminSchema } from "../schemas/editFromAdmin.schema";
import type { EditFromAdminService } from "../services/editFromAdmin.service";

interface EditFromAdminControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountRole: string;
}

export class EditFromAdminController {
  constructor(private readonly service: EditFromAdminService) {}

  async handle({ body, set, accountRole }: EditFromAdminControllerContext) {
    try {
      const parsedBody = editFromAdminSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const updatedAccount = await this.service.execute(
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
}
