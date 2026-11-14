import { findAccountById, updateAccount } from "../repositories/selfEdit.repository";

interface SelfEditInput {
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phone_no?: string;
  address?: string;
}

export async function selfEdit(
  accountId: string,
  input: SelfEditInput,
  userRole: string,
) {
  const account = await findAccountById(accountId);

  if (!account) {
    throw new Error("Account not found.");
  }

  if (input.role && userRole.toLowerCase() !== "director") {
    throw new Error("Only directors may change the role field.");
  }

  const updateData = {
    email: input.email,
    fullname: input.fullname,
    role: input.role,
    sex: input.sex,
    phoneNo: input.phone_no,
    address: input.address,
  };

  const updatedAccount = await updateAccount(accountId, updateData);

  return updatedAccount;
}
