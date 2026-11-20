import Link from "next/link";

export default function PaymentCancelPage() {
  return <main className="status-page"><div className="status-card"><span className="status-code">Payment cancelled</span><h1>No charge was made.</h1><p>Your booking has not been confirmed. You can return and try again.</p><Link className="button button-dark" href="/equipment">Back to equipment</Link></div></main>;
}
