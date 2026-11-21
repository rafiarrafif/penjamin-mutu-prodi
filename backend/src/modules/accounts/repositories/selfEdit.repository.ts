import type { prisma } from "../../../utils/prisma";

export interface SelfEditUpdateData {
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phoneNo?: string;
  address?: string;
}

export interface SelfEditRepositoryPort {
  findById(accountId: string): Promise<{ id: string } | null>;
  update(accountId: string, data: SelfEditUpdateData): Promise<unknown>;
}

export class SelfEditRepository implements SelfEditRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findById(accountId: string) {
    return this.db.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        sex: true,
        phoneNo: true,
        address: true,
        isVerified: true,
      },
    });
  }

  update(accountId: string, data: SelfEditUpdateData) {
    return this.db.account.update({
      where: { id: accountId },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.fullname && { fullname: data.fullname }),
        ...(data.role && { role: data.role }),
        ...(data.sex && { sex: data.sex }),
        ...(data.phoneNo && { phoneNo: data.phoneNo }),
        ...(data.address && { address: data.address }),
        updatedAt: new Date(),
      },
    });
  }
}
