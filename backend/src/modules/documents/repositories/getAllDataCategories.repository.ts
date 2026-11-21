import { prisma } from "../../../utils/prisma";

export interface GetAllDataCategoriesRepositoryPort {
  findAll(): Promise<unknown[]>;
}

export class GetAllDataCategoriesRepository implements GetAllDataCategoriesRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  async findAll() {
    return this.db.dataCategory.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }
}
