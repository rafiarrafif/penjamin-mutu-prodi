import { prisma } from "../../../utils/prisma";

interface CreateSessionRecord {
  accountId: string;
  deviceType: string;
  deviceOs: string | null;
  browser: string | null;
  ipAddress: string | null;
}

export function createSessionRecord({
  accountId,
  deviceType,
  deviceOs,
  browser,
  ipAddress,
}: CreateSessionRecord) {
  return prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      accountId,
      deviceType,
      deviceOs,
      browser,
      ipAddress,
      loggedInAt: new Date(),
    },
    select: {
      id: true,
      accountId: true,
      deviceType: true,
      deviceOs: true,
      browser: true,
      ipAddress: true,
      loggedInAt: true,
      revokedAt: true,
    },
  });
}
