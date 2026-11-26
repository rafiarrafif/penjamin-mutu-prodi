import type { prisma } from "../../../utils/prisma";

export class DeletePeriodRepository {
  constructor(private readonly db: typeof prisma) {}
  findDeletable(id: string) {
    return this.db.period.findFirst({ where: { id, deletedAt: null } });
  }
  countSubmissions(id: string) {
    return this.db.dataSubmission.count({
      where: { periodId: id, deletedAt: null },
    });
  }
  softDelete(id: string) {
    const now = new Date();
    return this.db.period.update({
      where: { id },
      data: { deletedAt: now, updatedAt: now },
    });
  }
}
