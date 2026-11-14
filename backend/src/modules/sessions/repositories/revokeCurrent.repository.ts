import { prisma } from "../../../utils/prisma";

export async function findSessionById(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      accountId: true,
      revokedAt: true,
    },
  });
}

export async function revokeSessionRecord(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: {
      revokedAt: new Date(),
    },
  });
}
