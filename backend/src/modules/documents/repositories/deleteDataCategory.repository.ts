import { prisma } from "../../../utils/prisma";

export function findDeletableDataCategory(categoryId: string) {
  return prisma.dataCategory.findFirst({
    where: { id: categoryId, deletedAt: null },
  });
}

export function deleteDataCategory(categoryId: string) {
  const deletedAt = new Date();
  return prisma.dataCategory.update({
    where: { id: categoryId },
    data: { deletedAt, updatedAt: deletedAt },
  });
}
