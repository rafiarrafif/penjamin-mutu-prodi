import {
  findAccountByEmailForDeletion,
  softDeleteAccount,
} from "../repositories/deleteFromAdmin.repository";
import type { DeleteFromAdminInput } from "../schemas/deleteFromAdmin.schema";

export async function deleteAccountFromAdmin(input: DeleteFromAdminInput) {
  const account = await findAccountByEmailForDeletion(input.email);

  if (!account) {
    throw Object.assign(
      new Error("Account not found with the provided email."),
      {
        status: 404,
      },
    );
  }

  if (account.role.toLowerCase() === "director") {
    throw Object.assign(
      new Error("Director accounts cannot be deleted via this route."),
      {
        status: 403,
      },
    );
  }

  await softDeleteAccount(account.id);

  return { email: account.email };
}
