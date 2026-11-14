import { prisma } from "../../../utils/prisma";

export function findActiveSessionRecord(sessionId: string) {
  return prisma.session.findFirst({
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
