import type { CreateNewDepartmentInput } from "../schemas/createNewDepartment.schema";
import type { CreateNewDepartmentRepositoryPort } from "../repositories/createNewDepartment.repository";

export class CreateNewDepartmentService {
  constructor(private readonly repository: CreateNewDepartmentRepositoryPort) {}

  execute(
    input: Omit<CreateNewDepartmentInput, "operationType">,
    accountIdCreator: string,
  ) {
    return this.repository.create({ ...input, accountIdCreator });
  }
}
