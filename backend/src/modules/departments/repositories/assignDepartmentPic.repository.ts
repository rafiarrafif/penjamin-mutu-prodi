import type { prisma } from "../../../utils/prisma";

export interface AssignDepartmentPicRepositoryPort {
  departmentExists(departmentId: string): Promise<boolean>;
  requirementExists(requirementId: string): Promise<boolean>;
  findPair(
    departmentId: string,
    requirementId: string,
  ): Promise<{ deletedAt: Date | null } | null>;
  assign(
    departmentId: string,
    requirementId: string,
    accountIdAssigner: string,
  ): Promise<unknown>;
}

export class AssignDepartmentPicRepository implements AssignDepartmentPicRepositoryPort {
  constructor(private readonly db: typeof prisma) {}
  async departmentExists(departmentId: string) {
    return (
      (await this.db.department.count({
        where: { id: departmentId, deletedAt: null },
      })) > 0
    );
  }
  async requirementExists(requirementId: string) {
    return (
      (await this.db.dataRequirement.count({
        where: { id: requirementId, deletedAt: null },
      })) > 0
    );
  }
  findPair(departmentId: string, requirementId: string) {
    return this.db.departmentPic.findUnique({
      where: {
        departmentId_dataRequirementId: {
          departmentId,
          dataRequirementId: requirementId,
        },
      },
      select: { deletedAt: true },
    });
  }
  async assign(
    departmentId: string,
    requirementId: string,
    accountIdAssigner: string,
  ) {
    const now = new Date();
    return this.db.departmentPic.upsert({
      where: {
        departmentId_dataRequirementId: {
          departmentId,
          dataRequirementId: requirementId,
        },
      },
      update: { deletedAt: null, accountIdAssigner, updatedAt: now },
      create: {
        departmentId,
        dataRequirementId: requirementId,
        accountIdAssigner,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    });
  }
}
