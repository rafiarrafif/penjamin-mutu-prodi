import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { editRequirementSchema } from "../schemas/editRequirement.schema";
import type { EditRequirementService } from "../services/editRequirement.service";
export class EditRequirementController {
  constructor(private readonly service: EditRequirementService) {}
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
      const parsed = editRequirementSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const requirement = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          title: "Requirement updated",
          description: "The data requirement was updated successfully.",
          data: [requirement],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
