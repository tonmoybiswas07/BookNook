
import { authClient } from "@/app/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 1. Get JWT token from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      error?.message ||
        "JWT token not found. Please sign in again."
    );
  }

  // 2. Prepare request headers
  const headers = new Headers(options.headers);

  headers.set(
    "Authorization",
    `Bearer ${data.token}`
  );

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Prepare API URL
  const path = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_URL}${path}`;

  // 4. Fetch data with network error handling
  let response: Response;

  try {
    response = await fetch(url, {
  ...options,
  headers,
  cache: "no-store",
  credentials: "omit",
});
  } catch (err) {
  console.error("API Request Failed:", {
    url,
    method: options.method || "GET",
    error: err,
  });

  const message =
    err instanceof Error
      ? err.message
      : "Unknown network error";

  throw new Error(
    `Failed to connect to ${url}: ${message}`,
    { cause: err }
  );
}

  // 5. Parse response safely
  const contentType =
    response.headers.get("content-type") || "";

  let result: unknown = null;

  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Invalid JSON response from server."
        );
      }
    } else {
      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `API Error ${response.status}: ${
            text.slice(0, 200) ||
            response.statusText
          }`
        );
      }

      throw new Error(
        "Server did not return a JSON response."
      );
    }
  }

  // 6. Handle HTTP errors
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `Request failed: ${response.status}`;

    if (response.status === 401) {
      throw new Error(
        `Unauthorized: ${message}`
      );
    }

    if (response.status === 403) {
      throw new Error(
        `Access denied: ${message}`
      );
    }

    if (response.status === 404) {
      throw new Error(
        `API endpoint not found: ${path}`
      );
    }

    throw new Error(message);
  }

  // 7. Return successful response
  if (response.status === 204) {
    return undefined as T;
  }

  return result as T;
}
