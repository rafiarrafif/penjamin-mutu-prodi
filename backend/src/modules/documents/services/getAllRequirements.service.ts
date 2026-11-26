import type { GetAllRequirementsInput } from "../schemas/getAllRequirements.schema";
import type { GetAllRequirementsRepository } from "../repositories/getAllRequirements.repository";

export class GetAllRequirementsService {
  constructor(private readonly repository: GetAllRequirementsRepository) {}
  execute(input: GetAllRequirementsInput) {
    return this.repository.findAll(input.category_id, input.frequency_code);
  }
}
