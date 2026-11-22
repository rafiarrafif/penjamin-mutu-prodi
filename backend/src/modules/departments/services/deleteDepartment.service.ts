import type { DeleteDepartmentInput } from "../schemas/deleteDepartment.schema";
import type { DeleteDepartmentRepositoryPort } from "../repositories/deleteDepartment.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class DeleteDepartmentService {
  constructor(
    private readonly repository: DeleteDepartmentRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}

  async execute(
    input: DeleteDepartmentInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findById(input.department_id);
    if (!existing) {
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    }

    await this.repository.deleteTransaction(input.department_id);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: input.department_id,
      tableName: "departments",
      action: "delete",
      description: `Soft deleted department "${existing.name}".`,
    });
  }
}
