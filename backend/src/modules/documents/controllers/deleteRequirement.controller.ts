import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { deleteRequirementSchema } from "../schemas/deleteRequirement.schema";
import type { DeleteRequirementService } from "../services/deleteRequirement.service";
export class DeleteRequirementController {
  constructor(private readonly service: DeleteRequirementService) {}
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
      const parsed = deleteRequirementSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const deleted = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Requirement deleted",
          description:
            "The data requirement and its PIC assignments were soft-deleted successfully.",
          data: [deleted],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
