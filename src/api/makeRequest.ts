import { IErrorResponse } from "../types/AppTypes";
import { API_BASE_URL } from "./apiConstants";

const createApiError = (message: string, error: string): IErrorResponse => ({
  message,
  error,
});

let globalErrorHandler: ((error: IErrorResponse) => void) | null = null;

export const setGlobalErrorHandler = (
  handler: (error: IErrorResponse) => void,
) => {
  globalErrorHandler = handler;
};

const getHeaders = (options: RequestInit): HeadersInit => {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

interface ErrorData {
  message?: string;
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ErrorData;
    const errorMessage =
      errorData.message || `Request failed with status ${response.status}`;
    const errorType = errorData.error || `HTTP_ERROR_${response.status}`;

    const error = createApiError(errorMessage, errorType);

    if (response.status >= 500 && globalErrorHandler) {
      globalErrorHandler(error);
    }

    throw error;
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
};

const isApiError = (error: unknown): error is IErrorResponse => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "message" in error
  );
};

const handleError = (error: unknown): never => {
  if (isApiError(error)) {
    throw error;
  }
  const netError = createApiError(
    error instanceof Error ? error.message : "Unknown error occurred",
    "NETWORK_OR_UNKNOWN_ERROR",
  );

  if (globalErrorHandler) {
    globalErrorHandler(netError);
  }
  throw netError;
};

export async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = getHeaders(options);

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
    .then(handleResponse<T>)
    .catch(handleError);
}
