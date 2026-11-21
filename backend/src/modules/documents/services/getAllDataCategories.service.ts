import type { GetAllDataCategoriesInput } from "../schemas/getAllDataCategories.schema";
import type { GetAllDataCategoriesRepositoryPort } from "../repositories/getAllDataCategories.repository";

export class GetAllDataCategoriesService {
  constructor(
    private readonly repository: GetAllDataCategoriesRepositoryPort,
  ) {}

  async execute(_input: GetAllDataCategoriesInput) {
    return this.repository.findAll();
  }
}
