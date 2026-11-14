import { prisma } from "../../../utils/prisma";

export async function findAccountById(accountId: string) {
  return prisma.account.findUnique({
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

interface UpdateAccountData {
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phoneNo?: string;
  address?: string;
}

export async function updateAccount(
  accountId: string,
  data: UpdateAccountData,
) {
  return prisma.account.update({
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
