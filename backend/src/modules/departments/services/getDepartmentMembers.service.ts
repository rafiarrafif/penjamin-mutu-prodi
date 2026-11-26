import type { GetDepartmentMembersInput } from "../schemas/getDepartmentMembers.schema";
import type { GetDepartmentMembersRepositoryPort } from "../repositories/getDepartmentMembers.repository";
export class GetDepartmentMembersService {
  constructor(
    private readonly repository: GetDepartmentMembersRepositoryPort,
  ) {}
  async execute(
    input: GetDepartmentMembersInput,
    accountId: string,
    accountRole: string,
  ) {
    if (!(await this.repository.departmentExists(input.department_id)))
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    if (
      accountRole.toLowerCase() === "lecturer" &&
      !(await this.repository.hasActiveMembership(
        input.department_id,
        accountId,
      ))
    )
      throw Object.assign(
        new Error(
          "A lecturer may only read members of a department in which they have an active membership.",
        ),
        { statusCode: 403 },
      );
    return this.repository.findMembers(
      input.department_id,
      input.include_ended,
    );
  }
}
