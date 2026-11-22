"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code">Error</span>
        <h1>Something needs a second look.</h1>
        <p>{error.message || "An unexpected error occurred. Try again or return to the marketplace."}</p>
        <div className="status-actions">
          <button className="button button-primary" type="button" onClick={() => reset()}>Try again</button>
          <Link className="button button-dark" href="/">Back home</Link>
        </div>
      </div>
    </main>
  );
}
