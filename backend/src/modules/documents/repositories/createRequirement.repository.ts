import type { prisma } from "../../../utils/prisma";

export class CreateRequirementRepository {
  constructor(private readonly db: typeof prisma) {}
  findCategory(id: string) {
    return this.db.dataCategory.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }
  findFrequency(code: string) {
    return this.db.frequency.findFirst({
      where: { code, deletedAt: null },
      select: { code: true },
    });
  }
  create(input: { categoryId: string; frequencyCode: string; name: string }) {
    const now = new Date();
    return this.db.dataRequirement.create({
      data: {
        id: crypto.randomUUID(),
        dataCategoryId: input.categoryId,
        frequencyCode: input.frequencyCode,
        name: input.name,
        createdAt: now,
        updatedAt: now,
      },
      include: { category: true, frequency: true },
    });
  }
}
