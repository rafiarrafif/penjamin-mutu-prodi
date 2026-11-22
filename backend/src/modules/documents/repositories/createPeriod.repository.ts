import type { prisma } from "../../../utils/prisma";

export class CreatePeriodRepository {
  constructor(private readonly db: typeof prisma) {}
  findFrequency(code: string) {
    return this.db.frequency.findFirst({
      where: { code, deletedAt: null },
      select: { code: true },
    });
  }
  create(input: {
    frequencyCode: string;
    label: string;
    year: number;
    month?: number;
    semester?: number;
    startDate: Date;
    endDate: Date;
  }) {
    const now = new Date();
    return this.db.period.create({
      data: {
        id: crypto.randomUUID(),
        frequencyCode: input.frequencyCode,
        label: input.label,
        year: input.year,
        month: input.month ?? null,
        semester: input.semester ?? null,
        startDate: input.startDate,
        endDate: input.endDate,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
