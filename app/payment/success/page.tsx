"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import type { BookingRecord } from "../../../lib/types";

function SuccessInner() {
  const { token, loading } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "paid" | "error">("verifying");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!sessionId) {
      setStatus("error");
      setError("Missing Stripe session id.");
      return;
    }

    if (!token) {
      setStatus("error");
      setError("Please sign in to confirm your payment.");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const data = await apiFetch("/payments/verify", {
          method: "POST",
          body: JSON.stringify({ sessionId })
        }, token) as { booking: BookingRecord; status: string };

        if (cancelled) return;
        setBooking(data.booking);
        setStatus("paid");
        toast.success("Payment verified. Booking confirmed.");
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unable to verify payment.";
        setError(message);
        setStatus("error");
        toast.error(message);
      }
    }

    void verify();
    return () => { cancelled = true; };
  }, [loading, sessionId, token]);

  return (
    <main className="status-page">
      <div className="status-card">
        {status === "verifying" && (
          <>
            <span className="status-code">Verifying</span>
            <h1>Confirming your payment</h1>
            <p>Please wait while we update your rental booking and payment record.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <span className="success-icon"><Check /></span>
            <h1>Payment successful</h1>
            <p>
              Your payment was confirmed
              {booking?.totalAmount != null ? ` for $${booking.totalAmount.toFixed(2)}` : ""}
              {" "}and your rental booking is now active.
            </p>
            {booking?.transactionId && (
              <p style={{ fontSize: 12, color: "#7a877d" }}>Transaction: {booking.transactionId}</p>
            )}
            <div className="status-actions">
              <Link className="button button-dark" href="/dashboard/rentals">View my rentals</Link>
              <Link className="button button-light" href="/equipment">Keep browsing</Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <span className="status-code">Payment issue</span>
            <h1>We could not confirm payment</h1>
            <p>{error}</p>
            <div className="status-actions">
              <Link className="button button-dark" href="/dashboard/rentals">Check my rentals</Link>
              <Link className="button button-light" href="/equipment">Back to equipment</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<main className="status-page"><div className="status-card"><p>Loading payment status...</p></div></main>}>
      <SuccessInner />
    </Suspense>
  );
}
