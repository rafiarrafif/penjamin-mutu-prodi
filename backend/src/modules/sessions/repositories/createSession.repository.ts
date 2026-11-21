import type { prisma } from "../../../utils/prisma";

interface CreateSessionRecord {
  accountId: string;
  deviceType: string;
  deviceOs: string | null;
  browser: string | null;
  ipAddress: string | null;
}
export interface CreateSessionRepositoryPort {
  create(input: CreateSessionRecord): Promise<unknown>;
}
export class CreateSessionRepository implements CreateSessionRepositoryPort {
  constructor(private readonly db: typeof prisma) {}
  create({
    accountId,
    deviceType,
    deviceOs,
    browser,
    ipAddress,
  }: CreateSessionRecord) {
    return this.db.session.create({
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
}
