import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createRequirementSchema } from "../schemas/createRequirement.schema";
import type { CreateRequirementService } from "../services/createRequirement.service";
export class CreateRequirementController {
  constructor(private readonly service: CreateRequirementService) {}
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
      const parsed = createRequirementSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const requirement = await this.service.execute(
        parsed.data,
        accountId,
        sessionId,
      );
      return successResponse(
        { set },
        {
          status: 201,
          title: "Requirement created",
          description: "The data requirement was created successfully.",
          data: [requirement],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
