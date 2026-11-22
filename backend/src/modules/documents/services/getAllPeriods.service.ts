import type { GetAllPeriodsInput } from "../schemas/getAllPeriods.schema";
import type { GetAllPeriodsRepository } from "../repositories/getAllPeriods.repository";

export class GetAllPeriodsService {
  constructor(private readonly repository: GetAllPeriodsRepository) {}
  execute(input: GetAllPeriodsInput) {
    return this.repository.findAll(input.frequency_code, input.year);
  }
}
