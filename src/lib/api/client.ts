import { getAdminToken, notifyAdminUnauthorized } from "@/lib/auth";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const getApiUrl = () => {
  const value = import.meta.env.VITE_FETCH_URL;
  if (!value) throw new Error("VITE_FETCH_URL is not configured");
  return `${value.replace(/\/$/, "")}/`;
};

interface FetchWrapperParams extends Omit<RequestInit, "body"> {
  endpoint: string;
  queryParams?: object;
  body?: unknown;
}
export const apiFetchWrapper = async <T>({
  endpoint,
  queryParams,
  ...data
}: FetchWrapperParams): Promise<T> => {
  const url = new URL(endpoint.replace(/^\//, ""), getApiUrl());
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // FormData needs the browser-generated multipart boundary.
  const headers = new Headers(data.headers);
  const token = getAdminToken();
  if (token) headers.set("x-access-token", token);
  const isFormData = data.body instanceof FormData;
  let body: BodyInit | undefined;

  if (isFormData) {
    body = data.body as FormData;
  } else if (data.body !== undefined) {
    body = JSON.stringify(data.body);
  }

  if (data.body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...data,
    headers,
    body,
  });

  if (response.status === 401) notifyAdminUnauthorized();

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new ApiError(
      error?.message || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
};
