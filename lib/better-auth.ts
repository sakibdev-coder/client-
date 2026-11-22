"use client";

import { createAuthClient } from "better-auth/react";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/api\/?$/, "");

export const betterAuthClient = createAuthClient({
  baseURL: apiUrl,
  basePath: "/api/better-auth"
});
