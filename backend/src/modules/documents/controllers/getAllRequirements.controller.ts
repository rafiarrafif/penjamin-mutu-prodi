import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { getAllRequirementsSchema } from "../schemas/getAllRequirements.schema";
import type { GetAllRequirementsService } from "../services/getAllRequirements.service";
export class GetAllRequirementsController {
  constructor(private readonly service: GetAllRequirementsService) {}
  async handle({
    body,
    set,
  }: {
    body: unknown;
    set: { status?: number | string };
  }) {
    try {
      const parsed = getAllRequirementsSchema.safeParse(body);
      if (!parsed.success) return handleError(parsed.error, { set });
      const requirements = await this.service.execute(parsed.data);
      const items = requirements.map((requirement: any) => ({
        ...requirement,
        department_pics: requirement.departmentPics.map((pic: any) => ({
          id: pic.department.id,
          name: pic.department.name,
        })),
      }));
      return successResponse(
        { set },
        {
          title: "Requirements retrieved",
          description: "The data requirements were retrieved successfully.",
          data: items,
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
