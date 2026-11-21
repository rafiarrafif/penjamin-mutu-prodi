import slug from "slug";
import type { EditDataCategoryInput } from "../schemas/editDataCategory.schema";
import {
  editDataCategory as editDataCategoryRecord,
  findDataCategoryBySlugExceptId,
  findEditableDataCategory,
} from "../repositories/editDataCategory.repository";
import { appendActionLog } from "../../logs/services/appendActionLog.service";

export async function editDataCategory(
  input: EditDataCategoryInput,
  accountId: string,
  sessionId: string,
) {
  const existing = await findEditableDataCategory(input.category_id);
  if (!existing)
    throw Object.assign(new Error("Data category not found."), {
      statusCode: 404,
    });

  const baseSlug = slug(input.name).slice(0, 255);
  let categorySlug = baseSlug;
  let suffix = 2;

  while (
    await findDataCategoryBySlugExceptId(categorySlug, input.category_id)
  ) {
    const suffixText = `-${suffix}`;
    categorySlug = `${baseSlug.slice(0, 255 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  const category = await editDataCategoryRecord(
    input.category_id,
    input.name,
    categorySlug,
  );

  await appendActionLog({
    accountIdRelated: accountId,
    sessionIdRelated: sessionId,
    tableIdRelated: category.id,
    tableName: "data_categories",
    action: "update",
    description: `Updated data category "${category.name}" (previous name: "${existing.name}").`,
  });

  return category;
}
