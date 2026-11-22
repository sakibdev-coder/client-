import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code">404</span>
        <h1>That page is off the shelf.</h1>
        <p>We couldn&apos;t find the page you were looking for. Browse equipment or head back home.</p>
        <div className="status-actions">
          <Link className="button button-dark" href="/">Back to Equiply</Link>
          <Link className="button button-light" href="/equipment">All equipment</Link>
        </div>
      </div>
    </main>
  );
}
