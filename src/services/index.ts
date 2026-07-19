import { getAdminToken, notifyAdminUnauthorized } from "@/lib/auth";

export const API_URL = import.meta.env.VITE_FETCH_URL;

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
  try {
    let url = `${API_URL}/${endpoint}`;
    if (queryParams) {
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    // FormData needs its browser-generated multipart boundary. Other request
    // bodies in this app are JSON and should be serialized here once.
    const headers = new Headers(data.headers);
    headers.set("x-access-token", getAdminToken() || "");
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

    const req = await fetch(url, {
      ...data,
      headers,
      body,
    });

    if (req.status === 401) notifyAdminUnauthorized();

    if (!req.ok) {
      const error = await req.json().catch(() => null);
      throw new Error(error?.message || `HTTP error! Status: ${req.status}`);
    }

    const result = await req.json();
    return result;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
};
