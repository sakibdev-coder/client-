export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function getApiOrigin() {
  return API_URL.replace(/\/api\/?$/, "");
}
