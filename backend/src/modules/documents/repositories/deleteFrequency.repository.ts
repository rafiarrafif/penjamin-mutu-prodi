import type { prisma } from "../../../utils/prisma";

export class DeleteFrequencyRepository {
  constructor(private readonly db: typeof prisma) {}
  findDeletable(code: string) {
    return this.db.frequency.findFirst({ where: { code, deletedAt: null } });
  }
  countReferences(code: string) {
    return Promise.all([
      this.db.dataRequirement.count({
        where: { frequencyCode: code, deletedAt: null },
      }),
      this.db.period.count({ where: { frequencyCode: code, deletedAt: null } }),
    ]);
  }
  softDelete(code: string) {
    const now = new Date();
    return this.db.frequency.update({
      where: { code },
      data: { deletedAt: now, updatedAt: now },
    });
  }
}
