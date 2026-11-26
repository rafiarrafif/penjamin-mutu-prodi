import type { DeleteFrequencyInput } from "../schemas/deleteFrequency.schema";
import type { DeleteFrequencyRepository } from "../repositories/deleteFrequency.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class DeleteFrequencyService {
  constructor(
    private readonly repository: DeleteFrequencyRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: DeleteFrequencyInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findDeletable(input.code);
    if (!existing)
      throw Object.assign(new Error("Frequency not found."), {
        statusCode: 404,
      });
    const [requirements, periods] = await this.repository.countReferences(
      input.code,
    );
    if (requirements > 0 || periods > 0)
      throw Object.assign(
        new Error(
          "Frequency cannot be deleted while non-deleted data requirements or periods reference it.",
        ),
        { statusCode: 409 },
      );
    await this.repository.softDelete(input.code);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: input.code,
      tableName: "frequencies",
      action: "delete",
      description: `Soft deleted frequency "${input.code}".`,
    });
    return { code: input.code };
  }
}
