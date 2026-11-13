import { prisma } from "../../../utils/prisma";

interface CreateAccountRecord {
  fullname: string;
  email: string;
  role: "director" | "admin" | "verificator" | "lecturer";
  sex: "male" | "female";
  phoneNo?: string;
  address?: string;
  isVerified: boolean;
}

export function createAccount({
  fullname,
  email,
  role,
  sex,
  phoneNo,
  address,
  isVerified,
}: CreateAccountRecord) {
  const now = new Date();

  return prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      sub: "n/a",
      fullname,
      email,
      profilePicture: null,
      role,
      sex,
      phoneNo: phoneNo ?? null,
      address: address ?? null,
      isVerified,
      createdAt: now,
      updatedAt: now,
    },
  });
}