import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  return <main className="status-page"><div className="status-card"><span className="success-icon"><Check /></span><h1>Payment successful</h1><p>Your payment was confirmed and your rental booking is now active.</p><Link className="button button-dark" href="/dashboard/rentals">View my rentals</Link></div></main>;
}
