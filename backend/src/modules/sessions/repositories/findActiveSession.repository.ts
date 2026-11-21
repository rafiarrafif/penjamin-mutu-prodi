import type { prisma } from "../../../utils/prisma";

export interface FindActiveSessionRepositoryPort {
  findById(
    sessionId: string,
  ): Promise<{ account: { id: string; role: string } } | null>;
}

export class FindActiveSessionRepository implements FindActiveSessionRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findById(sessionId: string) {
    return this.db.session.findFirst({
      where: { id: sessionId, revokedAt: null },
      select: {
        account: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });
  }
}
