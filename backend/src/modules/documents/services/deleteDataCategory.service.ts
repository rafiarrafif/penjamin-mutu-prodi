import type { DeleteDataCategoryInput } from "../schemas/deleteDataCategory.schema";
import {
  deleteDataCategory as deleteDataCategoryRecord,
  findDeletableDataCategory,
} from "../repositories/deleteDataCategory.repository";
import { appendActionLog } from "../../logs/services/appendActionLog.service";

export async function deleteDataCategory(
  input: DeleteDataCategoryInput,
  accountId: string,
  sessionId: string,
) {
  const existing = await findDeletableDataCategory(input.category_id);
  if (!existing)
    throw Object.assign(new Error("Data category not found."), {
      statusCode: 404,
    });

  const category = await deleteDataCategoryRecord(input.category_id);

  await appendActionLog({
    accountIdRelated: accountId,
    sessionIdRelated: sessionId,
    tableIdRelated: category.id,
    tableName: "data_categories",
    action: "delete",
    description: `Soft deleted data category "${category.name}".`,
  });

  return category;
}
