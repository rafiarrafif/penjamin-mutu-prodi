import type { prisma } from "../../../utils/prisma";

export interface EditDataCategoryRepositoryPort {
  findEditable(
    categoryId: string,
  ): Promise<{ id: string; name: string } | null>;
  findSlugExceptId(
    slug: string,
    categoryId: string,
  ): Promise<{ id: string } | null>;
  update(
    categoryId: string,
    name: string,
    slugValue: string,
  ): Promise<{ id: string; name: string; slug: string }>;
}

export class EditDataCategoryRepository implements EditDataCategoryRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findEditable(categoryId: string) {
    return this.db.dataCategory.findFirst({
      where: { id: categoryId, deletedAt: null },
    });
  }

  findSlugExceptId(slug: string, categoryId: string) {
    return this.db.dataCategory.findFirst({
      where: { slug, id: { not: categoryId } },
      select: { id: true },
    });
  }

  update(categoryId: string, name: string, slugValue: string) {
    return this.db.dataCategory.update({
      where: { id: categoryId },
      data: { name, slug: slugValue, updatedAt: new Date() },
    });
  }
}
