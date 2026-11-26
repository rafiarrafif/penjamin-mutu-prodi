import type { prisma } from "../../../utils/prisma";

export class GetAllPeriodsRepository {
  constructor(private readonly db: typeof prisma) {}
  findAll(frequencyCode?: string, year?: number) {
    return this.db.period.findMany({
      where: {
        deletedAt: null,
        ...(frequencyCode ? { frequencyCode } : {}),
        ...(year !== undefined ? { year } : {}),
      },
      include: { frequency: true },
      orderBy: { startDate: "desc" },
    });
  }
}
