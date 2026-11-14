import { handleError } from "../../../helper/errorHandler";
import { successResponse } from "../../../helper/response";
import { revokeCurrent } from "../services/revokeCurrent.service";
import { revokeCurrentSchema } from "../schemas/revokeCurrent.schema";

interface RevokeCurrentControllerContext {
  body: unknown;
  set: { status?: number | string };
  sessionId: string;
}

export async function revokeCurrentController({
  body,
  set,
  sessionId,
}: RevokeCurrentControllerContext) {
  try {
    const parsedBody = revokeCurrentSchema.safeParse(body);
    if (!parsedBody.success) return handleError(parsedBody.error, { set });

    await revokeCurrent(sessionId);

    return successResponse(
      { set },
      {
        status: 200,
        title: "Session revoked",
        description: "Your current session has been revoked successfully.",
      },
    );
  } catch (error) {
    return handleError(error, { set });
  }
}
