import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createAccountSchema } from "../schemas/createAccount.schema";
import type { CreateAccountService } from "../services/createAccount.service";

interface CreateAccountControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountRole: string;
}

export class CreateAccountController {
  constructor(private readonly service: CreateAccountService) {}

  async handle({ body, set, accountRole }: CreateAccountControllerContext) {
    try {
      const parsedBody = createAccountSchema.safeParse(body);
      if (!parsedBody.success) return handleError(parsedBody.error, { set });

      const account = await this.service.execute(parsedBody.data, accountRole);

      return successResponse(
        { set },
        {
          status: 201,
          title: "Account created",
          description: "The account was added to the system successfully.",
          data: [account],
        },
      );
    } catch (error) {
      return handleError(error, { set });
    }
  }
}
