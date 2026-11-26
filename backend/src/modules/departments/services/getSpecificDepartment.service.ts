import type { GetSpecificDepartmentRepositoryPort } from "../repositories/getSpecificDepartment.repository";
export class GetSpecificDepartmentService {
  constructor(
    private readonly repository: GetSpecificDepartmentRepositoryPort,
  ) {}
  async execute(departmentId: string, accountId: string, accountRole: string) {
    const department = await this.repository.findById(departmentId);
    if (!department)
      throw Object.assign(new Error("Department not found."), {
        statusCode: 404,
      });
    if (
      accountRole.toLowerCase() === "lecturer" &&
      !(await this.repository.hasActiveMembership(departmentId, accountId))
    )
      throw Object.assign(
        new Error(
          "A lecturer may only read a department in which they have an active membership.",
        ),
        { statusCode: 403 },
      );
    return department;
  }
}
