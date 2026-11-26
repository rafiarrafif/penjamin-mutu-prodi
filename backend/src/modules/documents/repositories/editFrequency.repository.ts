import type { prisma } from "../../../utils/prisma";

export class EditFrequencyRepository {
  constructor(private readonly db: typeof prisma) {}
  findEditable(code: string) {
    return this.db.frequency.findFirst({ where: { code, deletedAt: null } });
  }
  update(code: string, label: string) {
    return this.db.frequency.update({
      where: { code },
      data: { label, updatedAt: new Date() },
    });
  }
}
