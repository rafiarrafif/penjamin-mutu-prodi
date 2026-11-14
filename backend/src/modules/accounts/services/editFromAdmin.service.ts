import { findAccountById, updateAccount } from "../repositories/editFromAdmin.repository";

interface EditFromAdminInput {
  account_id: string;
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phone_no?: string;
  address?: string;
}

export async function editFromAdmin(
  input: EditFromAdminInput,
  requesterRole: string,
) {
  const account = await findAccountById(input.account_id);

  if (!account) {
    throw new Error("Account not found with the provided ID.");
  }

  if (account.role === "director") {
    throw new Error("Director accounts cannot be edited via this method.");
  }

  if (input.role && requesterRole.toLowerCase() !== "director") {
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

  const updatedAccount = await updateAccount(input.account_id, updateData);

  return updatedAccount;
}
