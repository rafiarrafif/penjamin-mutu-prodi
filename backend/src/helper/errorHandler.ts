import "dotenv/config";
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

interface ParsedLocation {
  file: string;
  line: number | null;
  column: number | null;
  frame: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDebugEnabled(): boolean {
  return process.env.APP_DEBUG?.trim().toLowerCase() === "true";
}

function parseFirstLocation(stack?: string): ParsedLocation | null {
  if (!stack) return null;

  const frame = stack
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("at "));

  if (!frame) return null;

  const locationMatch = frame.match(/\((.*?):(\d+):(\d+)\)$/);
  const directMatch = frame.match(/at\s+(.*?):(\d+):(\d+)$/);
  const match = locationMatch ?? directMatch;

  if (!match) {
    return {
      file: frame.replace(/^at\s+/, ""),
      line: null,
      column: null,
      frame,
    };
  }

  return {
    file: match[1],
    line: Number(match[2]),
    column: Number(match[3]),
    frame,
  };
}

function toSafeDebugValue(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[Maximum depth reached]";
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "undefined") return undefined;
  if (value instanceof Date) return value.toISOString();

  if (value instanceof Error) {
    const record: Record<string, unknown> = {
      name: value.name,
      message: value.message,
    };

    for (const [key, property] of Object.entries(value)) {
      record[key] = toSafeDebugValue(property, depth + 1);
    }

    if (value.stack) record.stack = value.stack;
    if (value.cause !== undefined) {
      record.cause = toSafeDebugValue(value.cause, depth + 1);
    }

    return record;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSafeDebugValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, property] of Object.entries(value)) {
      result[key] = toSafeDebugValue(property, depth + 1);
    }
    return result;
  }

  return String(value);
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

function getDebugErrorDetails(error: unknown): unknown[] {
  const stack = error instanceof Error ? error.stack : undefined;
  const safeError = toSafeDebugValue(error);

  return [
    {
      ...(isRecord(safeError) ? safeError : { value: safeError }),
      location: parseFirstLocation(stack),
      backtrace: stack ? stack.split("\n").map((line) => line.trim()) : [],
      timestamp: new Date().toISOString(),
    },
  ];
}

function getErrorDetails(error: unknown, status: number): unknown[] {
  const validationIssues = getValidationIssues(error);
  if (validationIssues) {
    return validationIssues.map((issue) => ({
      field: issue.path?.map(String).join(".") ?? "",
      message: issue.message ?? "Invalid value",
    }));
  }

  if (isDebugEnabled()) return getDebugErrorDetails(error);

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
  const debugEnabled = isDebugEnabled();
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
  const defaultDescription = validationEnabledDescription(
    error,
    validationIssues,
    status,
    debugEnabled,
  );

  return errorResponse(context, {
    status,
    title: options.title ?? defaultTitle,
    description: options.description ?? defaultDescription,
    errors: getErrorDetails(error, status),
  });
}

function validationEnabledDescription(
  error: unknown,
  validationIssues: ValidationIssue[] | undefined,
  status: number,
  debugEnabled: boolean,
): string {
  if (validationIssues) {
    return "One or more request fields are invalid.";
  }

  if (!debugEnabled) {
    if (status === 404) return "The requested resource was not found.";
    if (status === 409)
      return "The request conflicts with an existing record or relationship.";
    if (status >= 500) return "An unexpected error occurred.";
  }

  if (error instanceof Error) return error.message;
  return status >= 500
    ? "An unexpected error occurred."
    : "The request could not be completed.";
}
