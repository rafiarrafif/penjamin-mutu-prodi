import type { prisma } from "../../../utils/prisma";

export interface CreateDataCategoryRepositoryPort {
  findBySlug(categorySlug: string): Promise<{ id: string } | null>;
  create(
    name: string,
    categorySlug: string,
  ): Promise<{ id: string; name: string; slug: string }>;
}

export class CreateDataCategoryRepository implements CreateDataCategoryRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findBySlug(categorySlug: string) {
    return this.db.dataCategory.findFirst({
      where: { slug: categorySlug },
      select: { id: true },
    });
  }

  create(name: string, categorySlug: string) {
    const now = new Date();
    return this.db.dataCategory.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug: categorySlug,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
