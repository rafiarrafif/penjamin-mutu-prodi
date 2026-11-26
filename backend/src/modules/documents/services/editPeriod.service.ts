import type { EditPeriodInput } from "../schemas/editPeriod.schema";
import type { EditPeriodRepository } from "../repositories/editPeriod.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class EditPeriodService {
  constructor(
    private readonly repository: EditPeriodRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(input: EditPeriodInput, accountId: string, sessionId: string) {
    const existing = await this.repository.findEditable(input.period_id);
    if (!existing)
      throw Object.assign(new Error("Period not found."), { statusCode: 404 });
    const start =
      input.start_date ?? existing.startDate.toISOString().slice(0, 10);
    const end = input.end_date ?? existing.endDate.toISOString().slice(0, 10);
    if (end < start)
      throw Object.assign(
        new Error("end_date must not be earlier than start_date."),
        { statusCode: 400 },
      );
    const data: Record<string, unknown> = {};
    if (input.label !== undefined) data.label = input.label;
    if (input.year !== undefined) data.year = input.year;
    if (input.month !== undefined) data.month = input.month;
    if (input.semester !== undefined) data.semester = input.semester;
    if (input.start_date !== undefined)
      data.startDate = new Date(`${input.start_date}T00:00:00.000Z`);
    if (input.end_date !== undefined)
      data.endDate = new Date(`${input.end_date}T00:00:00.000Z`);
    const period = await this.repository.update(input.period_id, data);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: period.id,
      tableName: "periods",
      action: "update",
      description: `Updated period "${period.label}".`,
    });
    return period;
  }
}
