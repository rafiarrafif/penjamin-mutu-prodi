import type { EditFrequencyInput } from "../schemas/editFrequency.schema";
import type { EditFrequencyRepository } from "../repositories/editFrequency.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class EditFrequencyService {
  constructor(
    private readonly repository: EditFrequencyRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: EditFrequencyInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findEditable(input.code);
    if (!existing)
      throw Object.assign(new Error("Frequency not found."), {
        statusCode: 404,
      });
    const frequency = await this.repository.update(input.code, input.label);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: frequency.code,
      tableName: "frequencies",
      action: "update",
      description: `Updated frequency "${frequency.code}" label from "${existing.label}" to "${frequency.label}".`,
    });
    return frequency;
  }
}
