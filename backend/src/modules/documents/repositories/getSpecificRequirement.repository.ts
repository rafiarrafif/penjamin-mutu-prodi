import type { prisma } from "../../../utils/prisma";

export class GetSpecificRequirementRepository {
  constructor(private readonly db: typeof prisma) {}

  findById(id: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return this.db.dataRequirement.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        frequency: true,
        departmentPics: {
          where: { deletedAt: null, department: { deletedAt: null } },
          include: {
            department: {
              include: {
                histories: {
                  where: {
                    deletedAt: null,
                    startDate: { lte: today },
                    OR: [{ endDate: null }, { endDate: { gte: today } }],
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
