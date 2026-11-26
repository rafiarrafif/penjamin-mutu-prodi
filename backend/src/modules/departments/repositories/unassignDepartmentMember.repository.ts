import type { prisma } from "../../../utils/prisma";

export interface UnassignDepartmentMemberRepositoryPort {
  findActive(
    departmentId: string,
    accountId: string,
  ): Promise<{ id: string; startDate: Date } | null>;
  end(id: string, endDate: Date): Promise<unknown>;
}

export class UnassignDepartmentMemberRepository implements UnassignDepartmentMemberRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findActive(departmentId: string, accountId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return this.db.departmentHistory.findFirst({
      where: {
        departmentId,
        accountId,
        deletedAt: null,
        department: { deletedAt: null },
        account: { deletedAt: null },
        startDate: { lte: today },
        OR: [{ endDate: null }, { endDate: { gte: today } }],
      },
      select: { id: true, startDate: true },
      orderBy: { startDate: "desc" },
    });
  }

  end(id: string, endDate: Date) {
    const now = new Date();
    return this.db.departmentHistory.update({
      where: { id },
      data: { endDate, updatedAt: now },
    });
  }
}
