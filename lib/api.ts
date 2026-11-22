import type { User } from "./auth";
import { API_URL } from "./config";

export async function authRequest(path: string, body: Record<string, string>) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json() as { message?: string; token?: string; user?: User };
  if (!response.ok) throw new Error(data.message || "Authentication request failed.");
  if (!data.token || !data.user) throw new Error("The server returned an invalid authentication response.");
  return data;
}

export async function googleRequest(credential: string) {
  return authRequest("/auth/google", { credential });
}

export async function apiFetch(path: string, options: RequestInit = {}, token?: string | null) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { message?: string }).message || "Request failed.");
  return data;
}
