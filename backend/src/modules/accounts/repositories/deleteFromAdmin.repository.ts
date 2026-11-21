import type { prisma } from "../../../utils/prisma";

export interface DeleteFromAdminRepositoryPort {
  findByEmail(
    email: string,
  ): Promise<{ id: string; email: string; role: string } | null>;
  softDelete(accountId: string): Promise<unknown>;
}

export class DeleteFromAdminRepository implements DeleteFromAdminRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findByEmail(email: string) {
    return this.db.account.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, email: true, role: true },
    });
  }

  softDelete(accountId: string) {
    const deletedAt = new Date();

    return this.db.$transaction([
      this.db.account.update({
        where: { id: accountId },
        data: { deletedAt, updatedAt: deletedAt },
      }),
      this.db.session.updateMany({
        where: { accountId, revokedAt: null },
        data: { revokedAt: deletedAt },
      }),
    ]);
  }
}
