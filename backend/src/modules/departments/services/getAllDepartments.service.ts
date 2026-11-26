import type { GetAllDepartmentsRepositoryPort } from "../repositories/getAllDepartments.repository";
export class GetAllDepartmentsService {
  constructor(private readonly repository: GetAllDepartmentsRepositoryPort) {}
  execute(accountId: string, accountRole: string) {
    return this.repository.findAll(accountId, accountRole);
  }
}
