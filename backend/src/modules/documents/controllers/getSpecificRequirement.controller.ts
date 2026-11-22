import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getSpecificRequirementSchema } from "../schemas/getSpecificRequirement.schema";
import type { GetSpecificRequirementService } from "../services/getSpecificRequirement.service";
export class GetSpecificRequirementController {
  constructor(private readonly service: GetSpecificRequirementService) {}
  async handle({
    body,
    set,
  }: {
    body: unknown;
    set: { status?: number | string };
  }) {
    try {
      const parsed = getSpecificRequirementSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const requirement = await this.service.execute(parsed.data);
      return successResponse(
        { set },
        {
          title: "Requirement retrieved",
          description: "The data requirement was retrieved successfully.",
          data: [requirement],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
