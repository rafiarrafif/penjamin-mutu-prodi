import type { prisma } from "../../../utils/prisma";

export interface GetSpecificDepartmentRepositoryPort {
  findById(departmentId: string): Promise<unknown | null>;
  hasActiveMembership(
    departmentId: string,
    accountId: string,
  ): Promise<boolean>;
}

export class GetSpecificDepartmentRepository implements GetSpecificDepartmentRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  async findById(departmentId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const department = await this.db.department.findFirst({
      where: { id: departmentId, deletedAt: null },
      include: {
        histories: {
          where: {
            deletedAt: null,
            startDate: { lte: today },
            OR: [{ endDate: null }, { endDate: { gte: today } }],
          },
          include: { account: { select: { id: true, fullname: true } } },
          orderBy: { startDate: "asc" },
        },
        pics: {
          where: { deletedAt: null, requirement: { deletedAt: null } },
          include: { requirement: { select: { id: true, name: true } } },
        },
      },
    });
    if (!department) return null;
    return {
      id: department.id,
      name: department.name,
      description: department.description,
      active_members: department.histories.map((history: any) => ({
        account_id: history.accountId,
        fullname: history.account.fullname,
        start_date: history.startDate.toISOString().slice(0, 10),
      })),
      assigned_data_requirements: department.pics.map((pic: any) => ({
        id: pic.requirement.id,
        name: pic.requirement.name,
      })),
    };
  }

  async hasActiveMembership(departmentId: string, accountId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return (
      (await this.db.departmentHistory.count({
        where: {
          departmentId,
          accountId,
          deletedAt: null,
          department: { deletedAt: null },
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      })) > 0
    );
  }
}
