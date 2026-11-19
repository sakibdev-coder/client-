"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code">Oops</span>
        <h1>Something needs a second look.</h1>
        <p>Try again, or head back to the Equiply marketplace.</p>
        <div className="status-actions">
          <button className="button button-primary" onClick={() => reset()}>Try again</button>
          <a className="button button-dark" href="/">Back home</a>
        </div>
      </div>
    </main>
  );
}
