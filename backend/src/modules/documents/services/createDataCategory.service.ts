import slug from "slug";
import type { CreateDataCategoryInput } from "../schemas/createDataCategory.schema";
import {
  createDataCategory as createDataCategoryRecord,
  findDataCategoryBySlug,
} from "../repositories/createDataCategory.repository";
import { appendActionLog } from "../../logs/services/appendActionLog.service";

export async function createDataCategory(
  input: CreateDataCategoryInput,
  accountId: string,
  sessionId: string,
) {
  const baseSlug = slug(input.name).slice(0, 255);
  let categorySlug = baseSlug;
  let suffix = 2;

  while (await findDataCategoryBySlug(categorySlug)) {
    const suffixText = `-${suffix}`;
    categorySlug = `${baseSlug.slice(0, 255 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  const category = await createDataCategoryRecord(input.name, categorySlug);

  await appendActionLog({
    accountIdRelated: accountId,
    sessionIdRelated: sessionId,
    tableIdRelated: category.id,
    tableName: "data_categories",
    action: "create",
    description: `Created data category "${category.name}" with slug "${category.slug}".`,
  });

  return category;
}
