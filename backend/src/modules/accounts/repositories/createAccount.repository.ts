import type { prisma } from "../../../utils/prisma";

export interface CreateAccountRecord {
  fullname: string;
  email: string;
  role: "director" | "admin" | "verificator" | "lecturer";
  sex: "male" | "female";
  phoneNo?: string;
  address?: string;
  isVerified: boolean;
}

export interface CreateAccountRepositoryPort {
  create(input: CreateAccountRecord): Promise<unknown>;
}

export class CreateAccountRepository implements CreateAccountRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  create({
    fullname,
    email,
    role,
    sex,
    phoneNo,
    address,
    isVerified,
  }: CreateAccountRecord) {
    const now = new Date();

    return this.db.account.create({
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
}
