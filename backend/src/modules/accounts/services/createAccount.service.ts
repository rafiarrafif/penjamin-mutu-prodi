import { createAccount as createAccountRecord } from "../repositories/createAccount.repository";

interface CreateAccountInput {
  fullname: string;
  email: string;
  role: "director" | "admin" | "verificator" | "lecturer";
  sex: "male" | "female";
  phone_no?: string;
  address?: string;
}

export function createAccount(input: CreateAccountInput, creatorRole: string) {
  return createAccountRecord({
    fullname: input.fullname,
    email: input.email,
    role: input.role,
    sex: input.sex,
    phoneNo: input.phone_no,
    address: input.address,
    isVerified: creatorRole.toLowerCase() === "director",
  });
}
