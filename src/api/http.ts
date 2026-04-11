// For Digital Ocean: leave empty (uses same domain)
// For Railway/Vercel: set to full Railway URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function http<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const url = typeof input === "string" && input.startsWith("/") 
    ? `${API_BASE_URL}${input}` 
    : input;
  
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(url, { ...init, headers });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const errorFromJson =
      typeof body === "object" && body !== null && "error" in body
        ? (body as { error?: unknown }).error
        : undefined;
    const message =
      errorFromJson !== undefined ? String(errorFromJson) : `http_${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

