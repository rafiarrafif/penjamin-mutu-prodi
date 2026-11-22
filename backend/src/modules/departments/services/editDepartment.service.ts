import type { EditDepartmentInput } from "../schemas/editDepartment.schema";
import type { EditDepartmentRepositoryPort } from "../repositories/editDepartment.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";
export class EditDepartmentService {
  constructor(
    private readonly repository: EditDepartmentRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: EditDepartmentInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findById(input.department_id);
    if (!existing)
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    const data: { name?: string; description?: string | null } = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    const department = await this.repository.update(
      input.department_id,
      data,
      accountId,
    );
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: input.department_id,
      tableName: "departments",
      action: "update",
      description: `Updated department "${existing.name}".`,
    });
    return department;
  }
}
