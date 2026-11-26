import type { DeletePeriodInput } from "../schemas/deletePeriod.schema";
import type { DeletePeriodRepository } from "../repositories/deletePeriod.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class DeletePeriodService {
  constructor(
    private readonly repository: DeletePeriodRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: DeletePeriodInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findDeletable(input.period_id);
    if (!existing)
      throw Object.assign(new Error("Period not found."), { statusCode: 404 });
    const submissions = await this.repository.countSubmissions(input.period_id);
    if (submissions > 0)
      throw Object.assign(
        new Error(
          "Period cannot be deleted while non-deleted submissions reference it.",
        ),
        { statusCode: 409 },
      );
    await this.repository.softDelete(input.period_id);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: input.period_id,
      tableName: "periods",
      action: "delete",
      description: `Soft deleted period "${existing.label}" (${existing.id}).`,
    });
    return { id: existing.id };
  }
}
