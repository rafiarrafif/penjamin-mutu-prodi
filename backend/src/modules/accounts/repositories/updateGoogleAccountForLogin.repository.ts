import type { prisma } from "../../../utils/prisma";

export interface UpdateGoogleAccountForLoginRepositoryPort {
  update(
    email: string,
    sub: string,
    profilePicture: string | null,
  ): Promise<unknown | null>;
}

export class UpdateGoogleAccountForLoginRepository implements UpdateGoogleAccountForLoginRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  async update(email: string, sub: string, profilePicture: string | null) {
    const account = await this.db.account.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!account) return null;

    return this.db.account.update({
      where: { id: account.id },
      data: { sub, profilePicture },
    });
  }
}
