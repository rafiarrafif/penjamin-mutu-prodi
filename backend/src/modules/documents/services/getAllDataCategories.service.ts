import type { GetAllDataCategoriesInput } from "../schemas/getAllDataCategories.schema";
import { getAllDataCategories as getAllDataCategoriesRecord } from "../repositories/getAllDataCategories.repository";

export async function getAllDataCategories(_input: GetAllDataCategoriesInput) {
  return getAllDataCategoriesRecord();
}
