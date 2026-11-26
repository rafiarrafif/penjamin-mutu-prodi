import type { prisma } from "../../../utils/prisma";

export class GetAllRequirementsRepository {
  constructor(private readonly db: typeof prisma) {}
  findAll(categoryId?: string, frequencyCode?: string) {
    return this.db.dataRequirement.findMany({
      where: {
        deletedAt: null,
        ...(categoryId ? { dataCategoryId: categoryId } : {}),
        ...(frequencyCode ? { frequencyCode } : {}),
      },
      include: {
        frequency: true,
        departmentPics: {
          where: { deletedAt: null, department: { deletedAt: null } },
          include: { department: { select: { id: true, name: true } } },
        },
      },
      orderBy: { name: "asc" },
    });
  }
}
