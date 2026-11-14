import type { CreateNewDepartmentInput } from "../schemas/createNewDepartment.schema";
import { createNewDepartment as createNewDepartmentRecord } from "../repositories/createNewDepartment.repository";

export function createNewDepartment(
  input: Omit<CreateNewDepartmentInput, "operationType">,
  accountIdCreator: string,
) {
  return createNewDepartmentRecord({ ...input, accountIdCreator });
}
