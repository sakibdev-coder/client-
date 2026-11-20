import type { User } from "./auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function authRequest(path: string, body: Record<string, string>) {
  const response = await fetch(`${apiUrl}${path}`, {
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
