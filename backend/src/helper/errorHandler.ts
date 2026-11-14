import {
  errorResponse,
  type ErrorResponse,
  type ResponseContext,
} from "./response";

interface ErrorHandlerOptions {
  status?: number;
  title?: string;
  description?: string;
}

interface ValidationIssue {
  path?: PropertyKey[];
  message?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStatus(error: unknown, override?: number): number {
  if (override !== undefined) return override;
  if (!isRecord(error)) return 500;

  if (typeof error.code === "string") {
    if (error.code === "P2002" || error.code === "P2003") return 409;
    if (error.code === "P2025") return 404;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("cannot be edited") ||
      message.includes("only directors may change")
    ) {
      return 403;
    }
    if (
      message.includes("session not found") ||
      message.includes("already revoked")
    ) {
      return 404;
    }
  }

  const status = error.statusCode ?? error.status;
  return typeof status === "number" && status >= 400 && status <= 599
    ? status
    : 500;
}

function getValidationIssues(error: unknown): ValidationIssue[] | undefined {
  if (!isRecord(error) || !Array.isArray(error.issues)) return undefined;

  return error.issues.filter((issue): issue is ValidationIssue =>
    isRecord(issue),
  );
}

function getErrorDetails(error: unknown, status: number): unknown[] {
  const validationIssues = getValidationIssues(error);
  if (validationIssues) {
    return validationIssues.map((issue) => ({
      field: issue.path?.map(String).join(".") ?? "",
      message: issue.message ?? "Invalid value",
    }));
  }

  if (status === 409 && isRecord(error) && typeof error.code === "string") {
    return [{ code: error.code }];
  }

  if (status === 500) return [{ message: "An unexpected error occurred." }];

  if (error instanceof Error) return [{ message: error.message }];

  return [{ message: "The request could not be completed." }];
}

export function handleError(
  error: unknown,
  context: ResponseContext,
  options: ErrorHandlerOptions = {},
): ErrorResponse {
  const validationIssues = getValidationIssues(error);
  const status = validationIssues
    ? (options.status ?? 400)
    : getStatus(error, options.status);
  const isServerError = status >= 500;
  const defaultTitle = validationIssues
    ? "Validation failed"
    : status === 404
      ? "Not found"
      : status === 409
        ? "Conflict"
        : isServerError
          ? "Internal server error"
          : "Request failed";
  const defaultDescription = validationIssues
    ? "One or more request fields are invalid."
    : status === 404
      ? "The requested resource was not found."
      : status === 409
        ? "The request conflicts with an existing record or relationship."
        : isServerError
          ? "An unexpected error occurred."
          : error instanceof Error
            ? error.message
            : "The request could not be completed.";

  return errorResponse(context, {
    status,
    title: options.title ?? defaultTitle,
    description: options.description ?? defaultDescription,
    errors: getErrorDetails(error, status),
  });
}
