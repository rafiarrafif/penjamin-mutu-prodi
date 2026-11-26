import type { prisma } from "../../../utils/prisma";

export class EditRequirementRepository {
  constructor(private readonly db: typeof prisma) {}
  findEditable(id: string) {
    return this.db.dataRequirement.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, frequency: true },
    });
  }
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
  countSubmissions(id: string) {
    return this.db.dataSubmission.count({
      where: { dataRequirementId: id, deletedAt: null },
    });
  }
  update(id: string, data: Record<string, unknown>) {
    return this.db.dataRequirement.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: { category: true, frequency: true },
    });
  }
}
