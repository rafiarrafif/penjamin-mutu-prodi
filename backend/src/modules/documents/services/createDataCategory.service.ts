import slug from "slug";
import type { CreateDataCategoryInput } from "../schemas/createDataCategory.schema";
import {
  createDataCategory as createDataCategoryRecord,
  findDataCategoryBySlug,
} from "../repositories/createDataCategory.repository";

export async function createDataCategory(input: CreateDataCategoryInput) {
  const baseSlug = slug(input.name).slice(0, 255);
  let categorySlug = baseSlug;
  let suffix = 2;

  while (await findDataCategoryBySlug(categorySlug)) {
    const suffixText = `-${suffix}`;
    categorySlug = `${baseSlug.slice(0, 255 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  return createDataCategoryRecord(input.name, categorySlug);
}
