import type { FindActiveSessionRepositoryPort } from "../repositories/findActiveSession.repository";

export class FindActiveSessionService {
  constructor(private readonly repository: FindActiveSessionRepositoryPort) {}

  execute(sessionId: string) {
    return this.repository.findById(sessionId);
  }
}
