import type { prisma } from "../../../utils/prisma";

export interface AssignDepartmentMemberRepositoryPort {
  departmentExists(departmentId: string): Promise<boolean>;
  lecturerExists(accountId: string): Promise<boolean>;
  hasActiveMembership(
    departmentId: string,
    accountId: string,
  ): Promise<boolean>;
  create(input: {
    departmentId: string;
    accountId: string;
    startDate: Date;
    accountIdAssigner: string;
  }): Promise<unknown>;
}

export class AssignDepartmentMemberRepository implements AssignDepartmentMemberRepositoryPort {
  constructor(private readonly db: typeof prisma) {}
  async departmentExists(departmentId: string) {
    return (
      (await this.db.department.count({
        where: { id: departmentId, deletedAt: null },
      })) > 0
    );
  }
  async lecturerExists(accountId: string) {
    return (
      (await this.db.account.count({
        where: { id: accountId, deletedAt: null, role: "lecturer" },
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
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      })) > 0
    );
  }
  create(input: {
    departmentId: string;
    accountId: string;
    startDate: Date;
    accountIdAssigner: string;
  }) {
    const now = new Date();
    return this.db.departmentHistory.create({
      data: {
        id: crypto.randomUUID(),
        accountId: input.accountId,
        departmentId: input.departmentId,
        startDate: input.startDate,
        endDate: null,
        accountIdAssigner: input.accountIdAssigner,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    });
  }
}
