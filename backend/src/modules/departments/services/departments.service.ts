import type { CreateDepartmentInput } from "../schemas/departments.schema";
import { createDepartment as createDepartmentRecord } from "../repositories/departments.repository";

export function createDepartment(
  input: Omit<CreateDepartmentInput, "operationType">,
  accountIdCreator: string,
) {
  return createDepartmentRecord({ ...input, accountIdCreator });
}
