import {
  findAccountByEmail,
  updateAccountVerification,
} from "../repositories/approvalProvision.repository";

interface ApprovalProvisionInput {
  email: string;
}

interface ApprovalProvisionResult {
  alreadyVerified: boolean;
  account: {
    id: string;
    email: string;
    fullname: string;
    role: string;
    isVerified: boolean;
  };
}

export async function approvalProvision(
  input: ApprovalProvisionInput,
): Promise<ApprovalProvisionResult> {
  const account = await findAccountByEmail(input.email);

  if (!account) {
    throw new Error("Account not found with the provided email.");
  }

  if (account.isVerified) {
    return {
      alreadyVerified: true,
      account,
    };
  }

  const updatedAccount = await updateAccountVerification(account.id);

  return {
    alreadyVerified: false,
    account: updatedAccount,
  };
}
