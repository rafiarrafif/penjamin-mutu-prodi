import type { DeleteRequirementInput } from "../schemas/deleteRequirement.schema";
import type { DeleteRequirementRepository } from "../repositories/deleteRequirement.repository";

export class DeleteRequirementService {
  constructor(private readonly repository: DeleteRequirementRepository) {}
  async execute(
    input: DeleteRequirementInput,
    accountId: string,
    sessionId: string,
  ) {
    const existing = await this.repository.findDeletable(input.requirement_id);
    if (!existing)
      throw Object.assign(new Error("Data requirement not found."), {
        statusCode: 404,
      });
    await this.repository.softDeleteWithPics(
      input.requirement_id,
      accountId,
      sessionId,
    );
    return { id: existing.id };
  }
}
