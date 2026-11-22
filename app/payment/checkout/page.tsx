"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

function CheckoutInner() {
  const { token, user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [message, setMessage] = useState("Preparing secure Stripe Checkout...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token || user?.role !== "Customer") {
      router.replace(`/login?next=${encodeURIComponent(`/payment/checkout?bookingId=${bookingId || ""}`)}`);
      return;
    }

    if (!bookingId) {
      setMessage("Missing booking reference.");
      setFailed(true);
      return;
    }

    let cancelled = false;

    async function startCheckout() {
      try {
        const data = await apiFetch("/payments/checkout", {
          method: "POST",
          body: JSON.stringify({ bookingId })
        }, token) as { url?: string };

        if (cancelled) return;
        if (!data.url) throw new Error("Stripe Checkout URL was not returned.");
        setMessage("Redirecting to Stripe...");
        window.location.href = data.url;
      } catch (error) {
        if (cancelled) return;
        const text = error instanceof Error ? error.message : "Unable to start Stripe Checkout.";
        setMessage(text);
        setFailed(true);
        toast.error(text);
      }
    }

    void startCheckout();
    return () => { cancelled = true; };
  }, [bookingId, loading, router, token, user?.role]);

  return (
    <main className="status-page">
      <div className="status-card">
        <span className="success-icon"><ShieldCheck /></span>
        <h1>Secure payment</h1>
        <p>{message}</p>
        {failed && (
          <div className="status-actions">
            <Link className="button button-dark" href="/dashboard/rentals">My rentals</Link>
            <Link className="button button-light" href="/equipment">Browse equipment</Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="status-page"><div className="status-card"><p>Loading checkout...</p></div></main>}>
      <CheckoutInner />
    </Suspense>
  );
}
