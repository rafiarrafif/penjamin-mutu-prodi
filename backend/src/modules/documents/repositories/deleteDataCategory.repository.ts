import type { prisma } from "../../../utils/prisma";

export interface DeleteDataCategoryRepositoryPort {
  findDeletable(
    categoryId: string,
  ): Promise<{ id: string; name: string } | null>;
  softDelete(categoryId: string): Promise<{ id: string; name: string }>;
}

export class DeleteDataCategoryRepository implements DeleteDataCategoryRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findDeletable(categoryId: string) {
    return this.db.dataCategory.findFirst({
      where: { id: categoryId, deletedAt: null },
    });
  }

  softDelete(categoryId: string) {
    const deletedAt = new Date();
    return this.db.dataCategory.update({
      where: { id: categoryId },
      data: { deletedAt, updatedAt: deletedAt },
    });
  }
}
