import type { AssignDepartmentPicInput } from "../schemas/assignDepartmentPic.schema";
import type { AssignDepartmentPicRepositoryPort } from "../repositories/assignDepartmentPic.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";
export class AssignDepartmentPicService {
  constructor(
    private readonly repository: AssignDepartmentPicRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}
  async execute(
    input: AssignDepartmentPicInput,
    accountId: string,
    sessionId: string,
  ) {
    if (!(await this.repository.departmentExists(input.department_id))) {
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    }
    if (!(await this.repository.requirementExists(input.data_requirement_id))) {
      throw Object.assign(new Error("Data requirement not found."), {
        statusCode: 404,
      });
    }
    const pair = await this.repository.findPair(
      input.department_id,
      input.data_requirement_id,
    );
    if (pair && pair.deletedAt === null) {
      throw Object.assign(
        new Error(
          "This department is already assigned as PIC for the data requirement.",
        ),
        { statusCode: 409 },
      );
    }
    const record = await this.repository.assign(
      input.department_id,
      input.data_requirement_id,
      accountId,
    );
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: `${input.department_id}:${input.data_requirement_id}`,
      tableName: "department_pics",
      action: "create",
      description: `Assigned department "${input.department_id}" as PIC for data requirement "${input.data_requirement_id}".`,
    });
    return record;
  }
}
