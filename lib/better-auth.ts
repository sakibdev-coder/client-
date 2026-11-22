"use client";

import { createAuthClient } from "better-auth/react";
import { getApiOrigin } from "./config";

export const betterAuthClient = createAuthClient({
  baseURL: getApiOrigin(),
  basePath: "/api/better-auth"
});
