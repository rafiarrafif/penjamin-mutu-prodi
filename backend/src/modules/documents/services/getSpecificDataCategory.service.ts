import type { GetSpecificDataCategoryInput } from "../schemas/getSpecificDataCategory.schema";
import type { GetSpecificDataCategoryRepositoryPort } from "../repositories/getSpecificDataCategory.repository";

export class GetSpecificDataCategoryService {
  constructor(
    private readonly repository: GetSpecificDataCategoryRepositoryPort,
  ) {}

  async execute(input: GetSpecificDataCategoryInput) {
    const category = await this.repository.findById(input.id);
    if (!category)
      throw Object.assign(new Error("Data category not found."), {
        statusCode: 404,
      });
    return category;
  }
}
