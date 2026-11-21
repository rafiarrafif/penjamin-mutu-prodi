import type { RevokeCurrentRepositoryPort } from "../repositories/revokeCurrent.repository";

export class RevokeCurrentService {
  constructor(private readonly repository: RevokeCurrentRepositoryPort) {}

  async execute(sessionId: string) {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error("Session not found or already revoked.");
    if (session.revokedAt) throw new Error("Session is already revoked.");
    return this.repository.revoke(sessionId);
  }
}
