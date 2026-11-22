import type { CreateFrequencyInput } from "../schemas/createFrequency.schema";
import type { CreateFrequencyRepository } from "../repositories/createFrequency.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class CreateFrequencyService {
  constructor(
    private readonly repository: CreateFrequencyRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: CreateFrequencyInput,
    accountId: string,
    sessionId: string,
  ) {
    if (await this.repository.findByCode(input.code))
      throw Object.assign(
        new Error(
          "Frequency code already exists, including if it was previously soft-deleted.",
        ),
        { statusCode: 409 },
      );
    const frequency = await this.repository.create(input.code, input.label);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: frequency.code,
      tableName: "frequencies",
      action: "create",
      description: `Created frequency "${frequency.code}" (${frequency.label}).`,
    });
    return frequency;
  }
}
