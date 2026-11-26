import type { prisma } from "../../../utils/prisma";

export interface DepartmentMemberRecord {
  account_id: string;
  fullname: string;
  email: string;
  start_date: string;
  end_date: string | null;
}

export interface GetDepartmentMembersRepositoryPort {
  departmentExists(departmentId: string): Promise<boolean>;
  hasActiveMembership(
    departmentId: string,
    accountId: string,
  ): Promise<boolean>;
  findMembers(
    departmentId: string,
    includeEnded: boolean,
  ): Promise<DepartmentMemberRecord[]>;
}

export class GetDepartmentMembersRepository implements GetDepartmentMembersRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  async departmentExists(departmentId: string) {
    return (
      (await this.db.department.count({
        where: { id: departmentId, deletedAt: null },
      })) > 0
    );
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
          account: { deletedAt: null },
        },
      })) > 0
    );
  }

  async findMembers(
    departmentId: string,
    includeEnded: boolean,
  ): Promise<DepartmentMemberRecord[]> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const rows = await this.db.departmentHistory.findMany({
      where: {
        departmentId,
        deletedAt: null,
        department: { deletedAt: null },
        account: { deletedAt: null },
        ...(includeEnded
          ? {}
          : {
              startDate: { lte: today },
              OR: [{ endDate: null }, { endDate: { gte: today } }],
            }),
      },
      include: {
        account: { select: { id: true, fullname: true, email: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return rows.map(
      (row: {
        account: { id: string; fullname: string; email: string };
        startDate: Date;
        endDate: Date | null;
      }) => ({
        account_id: row.account.id,
        fullname: row.account.fullname,
        email: row.account.email,
        start_date: row.startDate.toISOString().slice(0, 10),
        end_date: row.endDate ? row.endDate.toISOString().slice(0, 10) : null,
      }),
    );
  }
}
