import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { createAccount } from "../services/createAccount.service";
import { createAccountSchema } from "../schemas/createAccount.schema";

interface CreateAccountControllerContext {
  body: unknown;
  set: { status?: number | string };
  accountRole: string;
}

export async function createAccountController({
  body,
  set,
  accountRole,
}: CreateAccountControllerContext) {
  try {
    const parsedBody = createAccountSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    const account = await createAccount(parsedBody.data, accountRole);

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
