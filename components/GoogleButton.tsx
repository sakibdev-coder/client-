"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "../lib/auth";
import { googleRequest } from "../lib/api";
import { dashboardHome } from "../lib/roles";

export function GoogleButton({ onError }: { onError: (message: string) => void }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <button className="google-fallback" type="button" disabled>
        Google login is not configured
      </button>
    );
  }

  return (
    <div className={`google-login${busy ? " is-busy" : ""}`}>
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) {
            onError("Google credential was missing. Please try again.");
            return;
          }
          setBusy(true);
          try {
            const result = await googleRequest(response.credential);
            signIn(result.token!, result.user!);
            toast.success(`Welcome${result.user!.role === "Customer" ? "" : " back"}, ${result.user!.name.split(" ")[0]}!`);
            const next = new URLSearchParams(window.location.search).get("next");
            router.push(next || dashboardHome(result.user!.role));
          } catch (error) {
            onError(error instanceof Error ? error.message : "Google login failed.");
          } finally {
            setBusy(false);
          }
        }}
        onError={() => onError("Google login was cancelled or failed.")}
        useOneTap={false}
        theme="outline"
        size="large"
        width="384"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
