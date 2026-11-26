import type { GetAllFrequenciesRepository } from "../repositories/getAllFrequencies.repository";

export class GetAllFrequenciesService {
  constructor(private readonly repository: GetAllFrequenciesRepository) {}
  execute() {
    return this.repository.findAll();
  }
}
