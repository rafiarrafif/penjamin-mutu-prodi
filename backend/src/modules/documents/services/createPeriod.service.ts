import type { CreatePeriodInput } from "../schemas/createPeriod.schema";
import type { CreatePeriodRepository } from "../repositories/createPeriod.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class CreatePeriodService {
  constructor(
    private readonly repository: CreatePeriodRepository,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: CreatePeriodInput,
    accountId: string,
    sessionId: string,
  ) {
    if (!(await this.repository.findFrequency(input.frequency_code)))
      throw Object.assign(new Error("Frequency not found."), {
        statusCode: 404,
      });
    const period = await this.repository.create({
      frequencyCode: input.frequency_code,
      label: input.label,
      year: input.year,
      month: input.month,
      semester: input.semester,
      startDate: new Date(`${input.start_date}T00:00:00.000Z`),
      endDate: new Date(`${input.end_date}T00:00:00.000Z`),
    });
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: period.id,
      tableName: "periods",
      action: "create",
      description: `Created period "${period.label}" for frequency "${period.frequencyCode}".`,
    });
    return period;
  }
}
