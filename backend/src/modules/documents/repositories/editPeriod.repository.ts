import type { prisma } from "../../../utils/prisma";

export class EditPeriodRepository {
  constructor(private readonly db: typeof prisma) {}
  findEditable(id: string) {
    return this.db.period.findFirst({ where: { id, deletedAt: null } });
  }
  update(id: string, data: Record<string, unknown>) {
    return this.db.period.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }
}
