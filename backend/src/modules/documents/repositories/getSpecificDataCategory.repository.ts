import type { prisma } from "../../../utils/prisma";

export interface GetSpecificDataCategoryRepositoryPort {
  findById(categoryId: string): Promise<unknown | null>;
}

export class GetSpecificDataCategoryRepository implements GetSpecificDataCategoryRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findById(categoryId: string) {
    return this.db.dataCategory.findFirst({
      where: { id: categoryId, deletedAt: null },
      include: { requirements: { where: { deletedAt: null } } },
    });
  }
}
