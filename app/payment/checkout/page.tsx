"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const [state, setState] = useState("Preparing secure checkout...");
  useEffect(() => { const timer = window.setTimeout(() => setState("Stripe Checkout opens in the production environment when STRIPE_SECRET_KEY is configured."), 700); return () => clearTimeout(timer); }, []);
  return <main className="status-page"><div className="status-card"><span className="success-icon"><ShieldCheck /></span><h1>Secure payment</h1><p>{state}</p><a className="button button-dark" href="/dashboard/rentals">Back to rentals</a></div></main>;
}
