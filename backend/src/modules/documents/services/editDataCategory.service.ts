import slug from "slug";
import type { EditDataCategoryInput } from "../schemas/editDataCategory.schema";
import type { EditDataCategoryRepositoryPort } from "../repositories/editDataCategory.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class EditDataCategoryService {
  constructor(
    private readonly repository: EditDataCategoryRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}

  async execute(
    input: EditDataCategoryInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findEditable(input.category_id);
    if (!existing)
      throw Object.assign(new Error("Data category not found."), {
        statusCode: 404,
      });

    const baseSlug = slug(input.name).slice(0, 255);
    let categorySlug = baseSlug;
    let suffix = 2;

    while (
      await this.repository.findSlugExceptId(categorySlug, input.category_id)
    ) {
      const suffixText = `-${suffix}`;
      categorySlug = `${baseSlug.slice(0, 255 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }

    const category = await this.repository.update(
      input.category_id,
      input.name,
      categorySlug,
    );
    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: category.id,
      tableName: "data_categories",
      action: "update",
      description: `Updated data category "${category.name}" (previous name: "${existing.name}").`,
    });
    return category;
  }
}
