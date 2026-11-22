import type { prisma } from "../../../utils/prisma";

export class CreateFrequencyRepository {
  constructor(private readonly db: typeof prisma) {}
  findByCode(code: string) {
    return this.db.frequency.findUnique({
      where: { code },
      select: { code: true },
    });
  }
  create(code: string, label: string) {
    const now = new Date();
    return this.db.frequency.create({
      data: { code, label, createdAt: now, updatedAt: now },
    });
  }
}
