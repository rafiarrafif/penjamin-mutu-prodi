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

    const activeHistoryWhere = {
      startDate: { lte: today },
      OR: [{ endDate: null }, { endDate: { gte: today } }],
    };

    const [departments, activeHistories, activePics, activeRequirements] =
      await Promise.all([
        this.db.department.findMany({
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            description: true,
          },
          orderBy: { name: "asc" },
        }),
        this.db.departmentHistory.findMany({
          where: {
            ...activeHistoryWhere,
            ...(isLecturer ? { accountId } : {}),
          },
          select: { departmentId: true },
        }),
        this.db.departmentPic.findMany({
          select: { departmentId: true, dataRequirementId: true },
        }),
        this.db.dataRequirement.findMany({
          where: { deletedAt: null },
          select: { id: true },
        }),
      ]);

    const activeDepartmentIds = new Set(
      activeHistories
        .map((history) => history.departmentId)
        .filter(
          (departmentId, index, ids) => ids.indexOf(departmentId) === index,
        ),
    );

    const memberCounts = new Map<string, number>();
    for (const history of activeHistories) {
      memberCounts.set(
        history.departmentId,
        (memberCounts.get(history.departmentId) ?? 0) + 1,
      );
    }

    const activeRequirementIds = new Set(
      activeRequirements.map((requirement) => requirement.id),
    );
    const picCounts = new Map<string, number>();
    for (const pic of activePics) {
      if (!activeRequirementIds.has(pic.dataRequirementId)) continue;
      picCounts.set(
        pic.departmentId,
        (picCounts.get(pic.departmentId) ?? 0) + 1,
      );
    }

    const visibleDepartments = isLecturer
      ? departments.filter((department) =>
          activeDepartmentIds.has(department.id),
        )
      : departments;

    return visibleDepartments.map((department) => ({
      id: department.id,
      name: department.name,
      description: department.description,
      active_member_count: memberCounts.get(department.id) ?? 0,
      active_pic_assignment_count: picCounts.get(department.id) ?? 0,
    }));
  }
}
