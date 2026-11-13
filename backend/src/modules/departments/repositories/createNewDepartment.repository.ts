import { prisma } from "../../../utils/prisma";

interface CreateDepartmentRecord {
  name: string;
  description?: string;
  accountIdCreator: string;
}

export function createNewDepartment({
  name,
  description,
  accountIdCreator,
}: CreateDepartmentRecord) {
  const now = new Date();

  return prisma.department.create({
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
