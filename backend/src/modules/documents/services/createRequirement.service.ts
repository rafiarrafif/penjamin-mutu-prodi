import type { CreateRequirementInput } from "../schemas/createRequirement.schema";
import type { CreateRequirementRepository } from "../repositories/createRequirement.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class CreateRequirementService {
  constructor(
    private readonly repository: CreateRequirementRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: CreateRequirementInput,
    accountId: string,
    sessionId: string,
  ) {
    if (!(await this.repository.findCategory(input.category_id)))
      throw Object.assign(new Error("Data category not found."), {
        statusCode: 404,
      });
    if (!(await this.repository.findFrequency(input.frequency_code)))
      throw Object.assign(new Error("Frequency not found."), {
        statusCode: 404,
      });
    const requirement = await this.repository.create({
      categoryId: input.category_id,
      frequencyCode: input.frequency_code,
      name: input.name,
    });
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: requirement.id,
      tableName: "data_requirements",
      action: "create",
      description: `Created data requirement "${requirement.name}".`,
    });
    return requirement;
  }
}
