import type { prisma } from "../../../utils/prisma";

export interface ApprovalProvisionRepositoryPort {
  findByEmail(
    email: string,
  ): Promise<{
    id: string;
    email: string;
    fullname: string;
    role: string;
    isVerified: boolean;
  } | null>;
  verify(accountId: string): Promise<unknown>;
}
export class ApprovalProvisionRepository implements ApprovalProvisionRepositoryPort {
  constructor(private readonly db: typeof prisma) {}
  findByEmail(email: string) {
    return this.db.account.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        isVerified: true,
      },
    });
  }
  verify(accountId: string) {
    return this.db.account.update({
      where: { id: accountId },
      data: { isVerified: true, updatedAt: new Date() },
    });
  }
}
