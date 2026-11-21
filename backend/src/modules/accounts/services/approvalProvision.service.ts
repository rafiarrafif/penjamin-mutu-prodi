import type { ApprovalProvisionRepositoryPort } from "../repositories/approvalProvision.repository";

interface ApprovalProvisionInput {
  email: string;
}

export class ApprovalProvisionService {
  constructor(private readonly repository: ApprovalProvisionRepositoryPort) {}

  async execute(input: ApprovalProvisionInput) {
    const account = await this.repository.findByEmail(input.email);

    if (!account) {
      throw new Error("Account not found with the provided email.");
    }

    if (account.isVerified) {
      return {
        alreadyVerified: true,
        account,
      };
    }

    return {
      alreadyVerified: false,
      account: (await this.repository.verify(account.id)) as typeof account,
    };
  }
}
