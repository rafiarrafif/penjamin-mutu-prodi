import type { EditRequirementInput } from "../schemas/editRequirement.schema";
import type { EditRequirementRepository } from "../repositories/editRequirement.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class EditRequirementService {
  constructor(
    private readonly repository: EditRequirementRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: EditRequirementInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findEditable(input.requirement_id);
    if (!existing)
      throw Object.assign(new Error("Data requirement not found."), {
        statusCode: 404,
      });
    const data: Record<string, unknown> = {};
    if (input.category_id !== undefined) {
      if (!(await this.repository.findCategory(input.category_id)))
        throw Object.assign(new Error("Data category not found."), {
          statusCode: 404,
        });
      data.dataCategoryId = input.category_id;
    }
    if (input.frequency_code !== undefined) {
      if (!(await this.repository.findFrequency(input.frequency_code)))
        throw Object.assign(new Error("Frequency not found."), {
          statusCode: 404,
        });
      if (input.frequency_code !== existing.frequencyCode) {
        const submissions = await this.repository.countSubmissions(
          input.requirement_id,
        );
        if (submissions > 0)
          throw Object.assign(
            new Error(
              "Frequency cannot be changed while non-deleted submissions exist for this requirement.",
            ),
            { statusCode: 409 },
          );
      }
      data.frequencyCode = input.frequency_code;
    }
    if (input.name !== undefined) data.name = input.name;
    const requirement = await this.repository.update(
      input.requirement_id,
      data,
    );
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: requirement.id,
      tableName: "data_requirements",
      action: "update",
      description: `Updated data requirement "${requirement.name}".`,
    });
    return requirement;
  }
}
