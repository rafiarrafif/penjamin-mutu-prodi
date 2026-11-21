import { prisma } from "../../../utils/prisma";

export function findDataCategoryBySlug(categorySlug: string) {
  return prisma.dataCategory.findFirst({
    where: { slug: categorySlug },
    select: { id: true },
  });
}

export function createDataCategory(name: string, categorySlug: string) {
  const now = new Date();

  return prisma.dataCategory.create({
    data: {
      id: crypto.randomUUID(),
      name,
      slug: categorySlug,
      createdAt: now,
      updatedAt: now,
    },
  });
}
