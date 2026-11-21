import { prisma } from "../../../utils/prisma";

export function getAllDataCategories() {
  return prisma.dataCategory.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });
}
