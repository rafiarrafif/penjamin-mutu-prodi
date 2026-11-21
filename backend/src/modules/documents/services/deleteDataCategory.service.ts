import type { DeleteDataCategoryInput } from "../schemas/deleteDataCategory.schema";
import type { DeleteDataCategoryRepositoryPort } from "../repositories/deleteDataCategory.repository";
import type { AppendActionLogService } from "../../logs/services/appendActionLog.service";

export class DeleteDataCategoryService {
  constructor(
    private readonly repository: DeleteDataCategoryRepositoryPort,
    private readonly actionLogger: AppendActionLogService,
  ) {}

  async execute(
    input: DeleteDataCategoryInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findDeletable(input.category_id);
    if (!existing)
      throw Object.assign(new Error("Data category not found."), {
        statusCode: 404,
      });

    const category = await this.repository.softDelete(input.category_id);

    await this.actionLogger.execute({
      accountIdRelated: accountId,
      sessionIdRelated: sessionId,
      tableIdRelated: category.id,
      tableName: "data_categories",
      action: "delete",
      description: `Soft deleted data category "${category.name}".`,
    });

    return category;
  }
}
