"use client";

import { createAuthClient } from "better-auth/react";

const apiServer = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export const betterAuthClient = createAuthClient({
  baseURL: apiServer
});
