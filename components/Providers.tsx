"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../lib/auth";
import { SiteChrome } from "./SiteChrome";

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const app = (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#264e3e",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "13px"
          },
          success: { iconTheme: { primary: "#d8e86b", secondary: "#264e3e" } },
          error: { style: { background: "#9a554d" } }
        }}
      />
      <SiteChrome>{children}</SiteChrome>
    </AuthProvider>
  );

  if (!googleClientId) return app;
  return <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>;
}
