"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchGoogleBridge, useAuth } from "../../../lib/auth";
import { dashboardHome } from "../../../lib/roles";

export default function AuthCallbackPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("Finishing Google sign-in...");

  useEffect(() => {
    let cancelled = false;

    async function complete() {
      if (loading) return;

      if (user) {
        toast.success("Signed in with Google.");
        router.replace(dashboardHome(user.role));
        return;
      }

      try {
        const result = await fetchGoogleBridge();
        if (cancelled) return;
        if (!result) {
          setMessage("Google session not found. Redirecting to login...");
          toast.error("Google sign-in failed. Please try again.");
          router.replace("/login");
          return;
        }
        signIn(result.token, result.user);
        toast.success(`Welcome${result.user.role === "Customer" ? "" : ` back`}, ${result.user.name.split(" ")[0]}!`);
        router.replace(dashboardHome(result.user.role));
      } catch {
        if (cancelled) return;
        setMessage("Unable to complete Google sign-in.");
        toast.error("Unable to complete Google sign-in.");
        router.replace("/login");
      }
    }

    void complete();
    return () => { cancelled = true; };
  }, [loading, router, signIn, user]);

  return (
    <main className="status-page">
      <div className="status-card">
        <div className="eyebrow">Secure sign-in</div>
        <h1>Almost there</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
