"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CancelInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code">Payment cancelled</span>
        <h1>No charge was made.</h1>
        <p>
          Your Stripe Checkout was cancelled, so the booking has not been confirmed.
          {bookingId ? " You can resume payment from My Rentals or create a new booking." : " You can return and try again whenever you are ready."}
        </p>
        <div className="status-actions">
          <Link className="button button-dark" href="/dashboard/rentals">My rentals</Link>
          <Link className="button button-light" href="/equipment">Back to equipment</Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<main className="status-page"><div className="status-card"><p>Loading...</p></div></main>}>
      <CancelInner />
    </Suspense>
  );
}
