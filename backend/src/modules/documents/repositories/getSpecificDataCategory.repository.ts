import { prisma } from "../../../utils/prisma";

export function getSpecificDataCategory(categoryId: string) {
  return prisma.dataCategory.findFirst({
    where: { id: categoryId, deletedAt: null },
    include: {
      requirements: {
        where: { deletedAt: null },
      },
    },
  });
}
