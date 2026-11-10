export interface ResponseContext {
  set: {
    status?: number | string;
  };
}

export interface ApiMessage {
  title: string;
  description: string;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  status: number;
  message: ApiMessage;
  data?: T[];
}

export interface ErrorResponse {
  success: false;
  status: number;
  message: ApiMessage;
  errors: unknown[];
}

interface ResponseOptions<T = unknown> {
  status?: number;
  title: string;
  description: string;
  data?: T[];
}

interface ErrorResponseOptions {
  status?: number;
  title: string;
  description: string;
  errors?: unknown[];
}

export function successResponse<T>(
  context: ResponseContext,
  options: ResponseOptions<T>,
): SuccessResponse<T> {
  const status = options.status ?? 200;
  context.set.status = status;

  return {
    success: true,
    status,
    message: {
      title: options.title,
      description: options.description,
    },
    ...(options.data === undefined ? {} : { data: options.data }),
  };
}

export function errorResponse(
  context: ResponseContext,
  options: ErrorResponseOptions,
): ErrorResponse {
  const status = options.status ?? 500;
  context.set.status = status;

  return {
    success: false,
    status,
    message: {
      title: options.title,
      description: options.description,
    },
    errors: options.errors ?? [],
  };
}
