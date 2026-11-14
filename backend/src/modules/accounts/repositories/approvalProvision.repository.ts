import { prisma } from "../../../utils/prisma";

export async function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
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

export async function updateAccountVerification(accountId: string) {
  return prisma.account.update({
    where: { id: accountId },
    data: {
      isVerified: true,
      updatedAt: new Date(),
    },
  });
}
