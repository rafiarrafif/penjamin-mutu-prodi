import type { AssignDepartmentMemberInput } from "../schemas/assignDepartmentMember.schema";
import type { AssignDepartmentMemberRepositoryPort } from "../repositories/assignDepartmentMember.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";
export class AssignDepartmentMemberService {
  constructor(
    private readonly repository: AssignDepartmentMemberRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: AssignDepartmentMemberInput,
    accountId: string,
    sessionId: string,
  ) {
    if (!(await this.repository.departmentExists(input.department_id)))
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    if (!(await this.repository.lecturerExists(input.account_id)))
      throw Object.assign(new Error("Account not found or not a lecturer."), {
        statusCode: 404,
      });
    if (
      await this.repository.hasActiveMembership(
        input.department_id,
        input.account_id,
      )
    )
      throw Object.assign(
        new Error(
          "The lecturer already has an active membership in this department.",
        ),
        { statusCode: 409 },
      );
    const startDate = new Date(
      `${input.start_date ?? new Date().toISOString().slice(0, 10)}T00:00:00.000Z`,
    );
    const record = await this.repository.create({
      departmentId: input.department_id,
      accountId: input.account_id,
      startDate,
      accountIdAssigner: accountId,
    });
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: `${input.department_id}:${input.account_id}`,
      tableName: "department_histories",
      action: "create",
      description: `Assigned account "${input.account_id}" to department "${input.department_id}".`,
    });
    return record;
  }
}
