import type { prisma } from "../../../utils/prisma";

export interface GetAllDepartmentsRepositoryPort {
  findAll(accountId: string, accountRole: string): Promise<unknown[]>;
}

export class GetAllDepartmentsRepository implements GetAllDepartmentsRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  async findAll(accountId: string, accountRole: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const role = accountRole.toLowerCase();
    const isLecturer = role === "lecturer";

    const departments = await this.db.department.findMany({
      where: {
        deletedAt: null,
        ...(isLecturer
          ? {
              histories: {
                some: {
                  accountId,
                  deletedAt: null,
                  startDate: { lte: today },
                  OR: [{ endDate: null }, { endDate: { gte: today } }],
                },
              },
            }
          : {}),
      },
      include: {
        histories: {
          where: {
            deletedAt: null,
            startDate: { lte: today },
            OR: [{ endDate: null }, { endDate: { gte: today } }],
          },
        },
        pics: {
          where: {
            deletedAt: null,
            department: { deletedAt: null },
            requirement: { deletedAt: null },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return departments.map(({ histories, pics, ...department }) => ({
      id: department.id,
      name: department.name,
      description: department.description,
      active_member_count: histories.length,
      active_pic_assignment_count: pics.length,
    }));
  }
}
