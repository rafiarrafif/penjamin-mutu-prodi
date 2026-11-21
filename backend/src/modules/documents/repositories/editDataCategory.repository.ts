import { prisma } from "../../../utils/prisma";

export function findEditableDataCategory(categoryId: string) {
  return prisma.dataCategory.findFirst({
    where: { id: categoryId, deletedAt: null },
  });
}

export function findDataCategoryBySlugExceptId(
  slug: string,
  categoryId: string,
) {
  return prisma.dataCategory.findFirst({
    where: { slug, id: { not: categoryId } },
    select: { id: true },
  });
}

export function editDataCategory(
  categoryId: string,
  name: string,
  slugValue: string,
) {
  return prisma.dataCategory.update({
    where: { id: categoryId },
    data: { name, slug: slugValue, updatedAt: new Date() },
  });
}
