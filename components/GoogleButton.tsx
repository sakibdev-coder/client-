"use client";

import { betterAuthClient } from "../lib/better-auth";

export function GoogleButton({ onError }: { onError: (message: string) => void }) {
  const continueWithGoogle = async () => {
    try {
      const { data, error } = await betterAuthClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`
      });
      if (error) throw new Error(error.message || "Google login could not be started.");
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      onError(error instanceof Error ? error.message : "Google login could not be started.");
    }
  };

  return (
    <button className="google-fallback" type="button" onClick={continueWithGoogle}>
      Continue with Google
    </button>
  );
}
