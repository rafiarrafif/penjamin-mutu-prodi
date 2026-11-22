import type { UnassignDepartmentMemberInput } from "../schemas/unassignDepartmentMember.schema";
import type { UnassignDepartmentMemberRepositoryPort } from "../repositories/unassignDepartmentMember.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";
export class UnassignDepartmentMemberService {
  constructor(
    private readonly repository: UnassignDepartmentMemberRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: UnassignDepartmentMemberInput,
    accountId: string,
    sessionId: string,
  ) {
    const active = await this.repository.findActive(
      input.department_id,
      input.account_id,
    );
    if (!active)
      throw Object.assign(
        new Error("Active department membership not found."),
        { statusCode: 404 },
      );
    const today = new Date().toISOString().slice(0, 10);
    const endDate = new Date(`${input.end_date ?? today}T00:00:00.000Z`);
    if (endDate < active.startDate)
      throw Object.assign(
        new Error(
          "end_date must not be earlier than the membership start_date.",
        ),
        { statusCode: 400 },
      );
    const record = await this.repository.end(active.id, endDate);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: active.id,
      tableName: "department_histories",
      action: "update",
      description: `Ended membership "${active.id}" of account "${input.account_id}" in department "${input.department_id}".`,
    });
    return record;
  }
}
