"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { googleRequest } from "../lib/api";
import { useAuth } from "../lib/auth";

export function GoogleButton({ onError }: { onError: (message: string) => void }) {
  const { signIn } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return <button className="google-fallback" type="button" onClick={() => onError("Google login is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable it.")}>Continue with Google</button>;
  return <GoogleOAuthProvider clientId={clientId}><div className="google-login"><GoogleLogin onSuccess={async ({ credential }) => { if (!credential) return onError("Google did not return a credential."); try { const result = await googleRequest(credential); signIn(result.token!, result.user!); window.location.href = "/dashboard"; } catch (error) { onError(error instanceof Error ? error.message : "Google login failed."); } }} onError={() => onError("Google login was cancelled or failed.")} /></div></GoogleOAuthProvider>;
}
