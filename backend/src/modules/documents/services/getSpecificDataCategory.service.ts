import type { GetSpecificDataCategoryInput } from "../schemas/getSpecificDataCategory.schema";
import { getSpecificDataCategory as getSpecificDataCategoryRecord } from "../repositories/getSpecificDataCategory.repository";

export async function getSpecificDataCategory(
  input: GetSpecificDataCategoryInput,
) {
  const category = await getSpecificDataCategoryRecord(input.id);
  if (!category)
    throw Object.assign(new Error("Data category not found."), {
      statusCode: 404,
    });
  return category;
}
