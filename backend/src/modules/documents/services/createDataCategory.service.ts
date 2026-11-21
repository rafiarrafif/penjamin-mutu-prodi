import slug from "slug";
import type { CreateDataCategoryInput } from "../schemas/createDataCategory.schema";
import type { CreateDataCategoryRepositoryPort } from "../repositories/createDataCategory.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class CreateDataCategoryService {
  constructor(
    private readonly repository: CreateDataCategoryRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}

  async execute(
    input: CreateDataCategoryInput,
    accountId: string,
    sessionId: string,
  ) {
    const baseSlug = slug(input.name).slice(0, 255);
    let categorySlug = baseSlug;
    let suffix = 2;

    while (await this.repository.findBySlug(categorySlug)) {
      const suffixText = `-${suffix}`;
      categorySlug = `${baseSlug.slice(0, 255 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }

    const category = await this.repository.create(input.name, categorySlug);
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: category.id,
      tableName: "data_categories",
      action: "create",
      description: `Created data category "${category.name}" with slug "${category.slug}".`,
    });
    return category;
  }
}
