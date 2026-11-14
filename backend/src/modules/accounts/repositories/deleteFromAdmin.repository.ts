import { prisma } from "../../../utils/prisma";

export async function findAccountByEmailForDeletion(email: string) {
  return prisma.account.findFirst({
    where: { email, deletedAt: null },
    select: { id: true, email: true, role: true },
  });
}

export async function softDeleteAccount(accountId: string) {
  const deletedAt = new Date();

  return prisma.$transaction([
    prisma.account.update({
      where: { id: accountId },
      data: { deletedAt, updatedAt: deletedAt },
    }),
    prisma.session.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: deletedAt },
    }),
  ]);
}
