import type { prisma } from "../../../utils/prisma";

export interface EditAccountData {
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phoneNo?: string;
  address?: string;
}

export interface EditFromAdminRepositoryPort {
  findById(accountId: string): Promise<{ id: string; role: string } | null>;
  update(accountId: string, data: EditAccountData): Promise<unknown>;
}

export class EditFromAdminRepository implements EditFromAdminRepositoryPort {
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

  update(accountId: string, data: EditAccountData) {
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
