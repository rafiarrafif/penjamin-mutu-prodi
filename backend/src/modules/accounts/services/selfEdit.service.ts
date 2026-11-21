import type { SelfEditRepositoryPort } from "../repositories/selfEdit.repository";

interface SelfEditInput {
  email?: string;
  fullname?: string;
  role?: string;
  sex?: string;
  phone_no?: string;
  address?: string;
}

export class SelfEditService {
  constructor(private readonly repository: SelfEditRepositoryPort) {}

  async execute(accountId: string, input: SelfEditInput, userRole: string) {
    const account = await this.repository.findById(accountId);

    if (!account) {
      throw new Error("Account not found.");
    }

    if (input.role && userRole.toLowerCase() !== "director") {
      throw new Error("Only directors may change the role field.");
    }

    return this.repository.update(accountId, {
      email: input.email,
      fullname: input.fullname,
      role: input.role,
      sex: input.sex,
      phoneNo: input.phone_no,
      address: input.address,
    });
  }
}
