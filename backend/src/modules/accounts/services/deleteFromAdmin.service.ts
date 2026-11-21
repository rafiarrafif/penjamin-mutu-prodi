import type { DeleteFromAdminInput } from "../schemas/deleteFromAdmin.schema";
import type { DeleteFromAdminRepositoryPort } from "../repositories/deleteFromAdmin.repository";

export class DeleteFromAdminService {
  constructor(private readonly repository: DeleteFromAdminRepositoryPort) {}

  async execute(input: DeleteFromAdminInput) {
    const account = await this.repository.findByEmail(input.email);

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

    await this.repository.softDelete(account.id);

    return { email: account.email };
  }
}
