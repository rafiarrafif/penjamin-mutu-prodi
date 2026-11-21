import type { prisma } from "../../../utils/prisma";

export interface CreateDepartmentRecord {
  name: string;
  description?: string;
  accountIdCreator: string;
}

export interface CreateNewDepartmentRepositoryPort {
  create(input: CreateDepartmentRecord): Promise<unknown>;
}

export class CreateNewDepartmentRepository implements CreateNewDepartmentRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  create({ name, description, accountIdCreator }: CreateDepartmentRecord) {
    const now = new Date();
    return this.db.department.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description: description ?? null,
        accountIdCreator,
        accountIdUpdater: null,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
