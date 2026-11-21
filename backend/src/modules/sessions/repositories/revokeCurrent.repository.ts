import type { prisma } from "../../../utils/prisma";

export interface RevokeCurrentRepositoryPort {
  findById(
    sessionId: string,
  ): Promise<{ id: string; accountId: string; revokedAt: Date | null } | null>;
  revoke(sessionId: string): Promise<unknown>;
}

export class RevokeCurrentRepository implements RevokeCurrentRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findById(sessionId: string) {
    return this.db.session.findUnique({
      where: { id: sessionId },
      select: { id: true, accountId: true, revokedAt: true },
    });
  }

  revoke(sessionId: string) {
    return this.db.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
