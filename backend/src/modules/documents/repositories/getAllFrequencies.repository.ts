import type { prisma } from "../../../utils/prisma";

export class GetAllFrequenciesRepository {
  constructor(private readonly db: typeof prisma) {}
  findAll() {
    return this.db.frequency.findMany({
      where: { deletedAt: null },
      orderBy: { code: "asc" },
    });
  }
}
